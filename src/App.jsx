//src/App.jsx

import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordSheet from './components/ChordSheet';
import ChordSheetControls from './components/ChordSheetControls';
import { Modal } from './components/Modal';


function App() {
  // State to manage the collection of chords
  const [chords, setChords] = useState([]);
  const [gridConfig, setGridConfig] = useState({ rows: 4, cols: 4 });
  const [showPreview, setShowPreview] = useState(false);
  const [editingChord, setEditingChord] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);



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
      // We're adding a new chord
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
    setGridConfig({ rows, cols });
    console.log('Grid changed:', { rows, cols });
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log('Export PDF');
  };


  return (

    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Chord and Scale Builder</h1>
            <div className="flex-grow flex justify-end">
              <ChordSheetControls 
                gridConfig={gridConfig}
                onGridChange={handleGridChange}
                onExport={handleExport}
                onPreview={() => setShowPreview(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Chord Creator */}
          <div className="lg:w-[400px] flex-shrink-0">
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingChord ? 'Edit Chord' : 'Create New Chord'}
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
              />
          </div>
        </div>
      </main>


      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="PDF Preview"
      >
        <ChordSheet 
          chords={chords} 
          gridConfig={gridConfig}
          isPreview={true}
        />
      </Modal>
    </div>
  
  );
 
};

export default App

