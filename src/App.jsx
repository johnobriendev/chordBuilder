//src/App.jsx

import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordSheet from './components/ChordSheet';
import ChordSheetControls from './components/ChordSheetControls';
import { Modal } from './components/Modal';
import { generatePDF } from './utils/pdfUtils';
import { HelpCircle, AlertTriangle } from 'lucide-react';



function App() {
  // State to manage the collection of chords
  const [chords, setChords] = useState([]);
  const [gridConfig, setGridConfig] = useState({ rows: 4, cols: 4 });
  const [showPreview, setShowPreview] = useState(false);
  const [editingChord, setEditingChord] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("My Chord Sheet");
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  // Calculate the maximum number of chords based on grid configuration
  const getMaxChords = (config) => config.rows * config.cols;

  

  // Handler for adding new chords to the sheet
  const handleAddChord = (chordData) => {
    if (editingIndex !== null) {
      // We're editing an existing chord
      const updatedChords = [...chords];
      updatedChords[editingIndex] = {
        ...chordData,
        id: editingChord.id // Preserve the original ID
      };
      setChords(updatedChords);
      setEditingChord(null);
      setEditingIndex(null);
    } else {
      // adding a new chord, see if limit is hit
      const maxChords = getMaxChords(gridConfig);

      if (chords.length >= maxChords) {
        // Show error message
        setError(`Cannot add more chords. The current ${gridConfig.rows}x${gridConfig.cols} grid can only display ${maxChords} chords. Please switch to a larger grid size or remove some chords.`);
        setShowError(true);
        
        // Automatically hide error after 5 seconds
        setTimeout(() => {
          setShowError(false);
          setError('');
        }, 5000);
        
        return; // Don't add the chord
      }


      //if limit wasn't hit, add the chord
      setChords(prevChords => [...prevChords, {
        ...chordData,
        id: chordData.id.toString()
      }]);
    }
  };

  // Handler for initiating chord edits
  const handleEditChord = (chord, index) => {
    setEditingChord(chord);
    setEditingIndex(index);
  };



  const handleGridChange = (event) => {
    const [cols, rows] = event.target.value.split('x').map(num => parseInt(num.trim()));
    const newConfig = { rows, cols };
    const maxChords = rows * cols;

    if (chords.length > maxChords) {
      setError(`Warning: Switching to a ${rows}x${cols} grid will hide ${chords.length - maxChords} chord(s). These hidden chords will still appear in the preview and PDF. Please remove some chords or switch to a larger grid.`);
      setShowError(true);
      
      // Keep error visible a bit longer for this warning
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 7000);
    }

    setGridConfig(newConfig);
  };

  const handleExport = async () => {
    try {
      // Find the modal content that contains the preview
      const modalContent = document.querySelector('.modal-preview-content');
      if (!modalContent) {
        throw new Error('Preview content not found');
      }
      
      // Generate PDF directly from the modal content
      const success = await generatePDF(modalContent, 'my-chord-sheet.pdf');
      
      if (success) {
        console.log('PDF generated successfully');
        // Optionally close the preview after successful export
        //setShowPreview(false);
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  // Generate the preview actions (buttons)
  const previewActions = (
    <>
      <button 
        onClick={() => setShowPreview(false)}
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
      >
        Close
      </button>
      <button 
        onClick={handleExport}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download PDF
      </button>
    </>
  );
  

  


  return (

    <div className="min-h-screen bg-slate-600">
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                      max-w-md w-full bg-red-50 border border-red-200 rounded-lg 
                      shadow-lg p-4 text-red-700">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              {error}
            </div>
          </div>
        </div>
      )}

      <header className="bg-stone-400 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-light text-gray-900">Chord and Scale Builder</h1>
            <button
                onClick={() => setShowHelp(true)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 
                         text-gray-700 rounded-md flex items-center gap-2"
              >
                <HelpCircle size={16} />
                How to Use
              </button>
            <div className="w-full sm:w-auto">
              <ChordSheetControls 
                gridConfig={gridConfig}
                onGridChange={handleGridChange}
                //onExport={handleExport}
                onPreview={() => setShowPreview(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Chord Creator */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <section className="bg-stone-300 rounded-lg shadow">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-light mb-4">
                  {editingChord ? 'Edit Chord' : 'Create New Chord or Scale'}
                </h2>
                <GuitarDiagram 
                  onAddToSheet={handleAddChord}
                  initialChord={editingChord}
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </section>
          </div>

          {/* Right column - Chord Sheet */}
          <div className="flex-grow">
              <ChordSheet 
                chords={chords} 
                gridConfig={gridConfig}
                setChords={setChords}
                onEditChord={handleEditChord}
                isInteractive={true} 
                title={sheetTitle}
                onTitleChange={setSheetTitle} 
              />
          </div>
        </div>
      </main>


      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="PDF Preview"
        actions={previewActions}
      >
        <ChordSheet 
          chords={chords} 
          gridConfig={gridConfig}
          isPreview={true}
          title={sheetTitle}
        />
      </Modal>


      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="How to Use Chord Sheet Builder"
      >
        <video 
            className="w-full max-w-3xl rounded-lg shadow-lg"
            controls
            autoPlay
            muted
          >
            <source src="/chordapp-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="space-y-6 mt-4 text-gray-700">
          <section>
            <h3 className="text-lg font-semibold mb-2">Creating Chords</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the diagram on the left to create your chord</li>
              <li>Click on the fretboard to add or remove notes</li>
              <li>Click above the strings to mark them as open strings</li>
              <li>Add fret numbers using the inputs on the left side if needed</li>
              <li>Give your chord a name in the input field above the diagram</li>
              <li>Click "Add to Sheet" to add it to your chord sheet</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Managing Your Chord Sheet</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose your grid size (4x4, 6x6, or 8x8) from the dropdown menu</li>
              <li>Click the Chord Sheet name to edit or erase it.</li>
              <li>Hover over any chord to reveal edit and delete buttons</li>
              <li>Click the edit button (pencil icon) to modify an existing chord</li>
              <li>Click the delete button (trash icon) to remove a chord</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Exporting Your Chord Sheet</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click "Preview & Export" to see how your sheet will look</li>
              <li>In the preview modal, click "Download PDF" to save your chord sheet</li>
              <li>The PDF will maintain the exact layout you see in the preview</li>
            </ul>
          </section>

        </div>

        
      </Modal>

      

    </div>
  
  );
 
};

export default App

{/* <div className="space-y-6 text-gray-700">
          <section>
            <h3 className="text-lg font-semibold mb-2">Creating Chords</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the diagram on the left to create your chord</li>
              <li>Click on the fretboard to add or remove notes</li>
              <li>Click above the strings to mark them as open strings</li>
              <li>Add fret numbers using the inputs on the left side if needed</li>
              <li>Give your chord a name in the input field above the diagram</li>
              <li>Click "Add to Sheet" to add it to your chord sheet</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Managing Your Chord Sheet</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose your grid size (4x4, 6x6, or 8x8) from the dropdown menu</li>
              <li>Click the Chord Sheet name to edit or erase it.</li>
              <li>Hover over any chord to reveal edit and delete buttons</li>
              <li>Click the edit button (pencil icon) to modify an existing chord</li>
              <li>Click the delete button (trash icon) to remove a chord</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Exporting Your Chord Sheet</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click "Preview & Export" to see how your sheet will look</li>
              <li>In the preview modal, click "Download PDF" to save your chord sheet</li>
              <li>The PDF will maintain the exact layout you see in the preview</li>
            </ul>
          </section>

        </div> */}