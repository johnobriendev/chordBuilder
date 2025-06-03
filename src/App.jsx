//src/App.jsx

import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordSheet from './components/ChordSheet';
import ChordSheetControls from './components/ChordSheetControls';
import Dashboard from './components/Dashboard';
import { Modal } from './components/Modal';
import AuthButton from './components/AuthButton';
import { generatePDF } from './utils/pdfUtils';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { setTokenGetter, createSheet, getCurrentUser, getSheet, updateSheet } from './services/api';




function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // State to manage the collection of chords
  const [chords, setChords] = useState([]);
  const [gridConfig, setGridConfig] = useState({ rows: 4, cols: 4, diagramType: '6-fret' });
  const [showPreview, setShowPreview] = useState(false);
  const [editingChord, setEditingChord] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("My Chord Sheet");
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentSheetId, setCurrentSheetId] = useState(null);

  // Initialize API service with Auth0 token getter
  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(getAccessTokenSilently);
    }
  }, [isAuthenticated, getAccessTokenSilently]);



  const getExpectedDiagramType = (config) => {
    return config.diagramType || '6-fret';
  };

  const isChordCompatibleWithGrid = (chord, gridConfig) => {
    if (!chord) return true;

    const chordFrets = chord.numFrets || 6;
    const expectedType = getExpectedDiagramType(gridConfig);

    if (expectedType === '6-fret' && chordFrets === 6) return true;
    if (expectedType === '12-fret' && chordFrets === 12) return true;

    return false;
  };


  const createSafeFilename = (title) => {
    // If title is empty or only whitespace, use default
    if (!title || title.trim().length === 0) {
      return 'my-chord-sheet.pdf';
    }

    // Remove or replace problematic characters
    // This regex removes: < > : " | ? * / \ and other control characters
    let safeTitle = title
      .replace(/[<>:"|?*\/\\]/g, '') // Remove completely invalid characters
      .replace(/\s+/g, '-') // Replace spaces and multiple whitespace with hyphens
      .replace(/[^\w\-_.]/g, '') // Remove any remaining non-word characters except hyphens, underscores, and dots
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
      .toLowerCase(); // Convert to lowercase for consistency

    // If after sanitization we have nothing left, use default
    if (safeTitle.length === 0) {
      return 'my-chord-sheet.pdf';
    }

    // Limit filename length to prevent filesystem issues
    if (safeTitle.length > 50) {
      safeTitle = safeTitle.substring(0, 50);
    }

    // Ensure it ends with .pdf
    return safeTitle.endsWith('.pdf') ? safeTitle : `${safeTitle}.pdf`;
  };

  // Calculate the maximum number of chords based on grid configuration
  const getMaxChords = (config) => config.rows * config.cols;



  // Handler for adding new chords to the sheet
  const handleAddChord = (chordData) => {
    if (editingIndex !== null) {
      // Editing existing chord - validate compatibility
      if (!isChordCompatibleWithGrid(chordData, gridConfig)) {
        const expectedFrets = gridConfig.diagramType === '12-fret' ? 12 : 6;
        setError(`This chord has ${chordData.numFrets} frets, but the current grid expects ${expectedFrets}-fret diagrams. Please switch to a compatible grid or adjust the chord's fret count.`);
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
          setError('');
        }, 5000);

        return;
      }

      const updatedChords = [...chords];
      updatedChords[editingIndex] = {
        ...chordData,
        id: editingChord.id
      };
      setChords(updatedChords);
      setEditingChord(null);
      setEditingIndex(null);
    } else {
      // Adding new chord - validate compatibility and capacity
      if (!isChordCompatibleWithGrid(chordData, gridConfig)) {
        const expectedFrets = gridConfig.diagramType === '12-fret' ? 12 : 6;
        setError(`This chord has ${chordData.numFrets} frets, but the current grid expects ${expectedFrets}-fret diagrams. Please switch to a compatible grid or adjust the chord's fret count.`);
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
          setError('');
        }, 5000);

        return;
      }

      const maxChords = getMaxChords(gridConfig);
      if (chords.length >= maxChords) {
        const gridLabel = `${gridConfig.rows}x${gridConfig.cols} ${gridConfig.diagramType}`;
        setError(`Cannot add more chords. The current ${gridLabel} grid can only display ${maxChords} chords. Please switch to a larger grid size or remove some chords.`);
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
          setError('');
        }, 5000);

        return;
      }

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


  const handleClearSheet = () => {
    // Reset all the state that accumulates over time
    setChords([]); // Clear all chords - this is the main goal
    setEditingChord(null); // Clear any chord currently being edited
    setEditingIndex(null); // Clear the editing index

  };

  const handleClearSheetRequest = () => {
    // Only show the modal if there are actually chords to clear
    // This prevents unnecessary confirmation when the sheet is already empty
    if (chords.length === 0) {
      setError('The sheet is already empty - no chords to clear.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 3000);
      return;
    }

    setShowClearConfirmation(true);
  };

  const handleConfirmClear = () => {
    handleClearSheet(); // Execute the actual clearing
    setShowClearConfirmation(false); // Close the modal
  };

  const handleCancelClear = () => {
    setShowClearConfirmation(false); // Just close the modal without clearing
  };



  const handleGridChange = (event) => {
    const value = event.target.value;

    // Parse format like "2x1-12-fret"
    const lastHyphenIndex = value.lastIndexOf('-');
    const dimensionsAndType = value.substring(0, lastHyphenIndex);
    const fretPart = value.substring(lastHyphenIndex + 1);

    const secondLastHyphenIndex = dimensionsAndType.lastIndexOf('-');
    const dimensions = dimensionsAndType.substring(0, secondLastHyphenIndex);
    const fretNumber = dimensionsAndType.substring(secondLastHyphenIndex + 1);

    const [cols, rows] = dimensions.split('x').map(num => parseInt(num.trim()));
    const diagramType = `${fretNumber}-${fretPart}`;

    const newConfig = { rows, cols, diagramType };
    const maxChords = rows * cols;

    // Check compatibility and capacity
    const incompatibleChords = chords.filter(chord => !isChordCompatibleWithGrid(chord, newConfig));

    if (incompatibleChords.length > 0) {
      const currentType = gridConfig.diagramType === '12-fret' ? '12' : '6';
      const newType = newConfig.diagramType === '12-fret' ? '12' : '6';

      setError(`Warning: You have ${incompatibleChords.length} chord(s) saved with ${currentType} frets, but you're switching to a ${newType}-fret grid. These incompatible chords will be hidden in the sheet view but will still appear in preview and PDF. Please delete all ${currentType} fret chords before continuing.`);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 7000);
    } else if (chords.length > maxChords) {
      const gridLabel = `${rows}x${cols} ${newConfig.diagramType}`;
      setError(`Warning: Switching to a ${gridLabel} grid will hide ${chords.length - maxChords} chord(s). These hidden chords will still appear in the preview and PDF.`);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 7000);
    }

    setGridConfig(newConfig);
  };


  const handleSaveSheet = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to save your sheet.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 3000);
      return;
    }

    if (chords.length === 0) {
      setError('Cannot save an empty sheet. Please add some chords first.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 3000);
      return;
    }

    try {
      await getCurrentUser();

      const sheetData = {
        title: sheetTitle,
        description: `${chords.length} chords`,
        gridType: gridConfig.diagramType,
        gridRows: gridConfig.rows,
        gridCols: gridConfig.cols,
        chords: chords.map((chord, index) => ({
          title: chord.title,
          positionInSheet: index,
          numStrings: chord.numStrings,
          numFrets: chord.numFrets,
          fretNumbers: chord.fretNumbers,
          notes: chord.notes,
          openStrings: chord.openStrings
        }))
      };

      let response;
      if (currentSheetId) {
        // Update existing sheet
        console.log('Updating existing sheet...');
        response = await updateSheet(currentSheetId, sheetData);
        setError(`Sheet "${sheetTitle}" updated successfully!`);
      } else {
        // Create new sheet
        console.log('Creating new sheet...');
        response = await createSheet(sheetData);
        setCurrentSheetId(response.sheet.id); // Track the new sheet ID
        setError(`Sheet "${sheetTitle}" saved successfully!`);
      }

      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 3000);

      console.log('Sheet saved/updated:', response);
    } catch (error) {
      console.error('Error saving sheet:', error);
      setError('Failed to save sheet. Please try again.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 5000);
    }
  };

  const handleLoadSheet = async (sheetData) => {
    try {
      // Get the full sheet data including chords
      const response = await getSheet(sheetData.id);
      const sheet = response.sheet;

      //set title so we know we're editing a sheet that exists already
      setCurrentSheetId(sheet.id);

      // Load the sheet data into your current state
      setSheetTitle(sheet.title);
      setGridConfig({
        rows: sheet.gridRows,
        cols: sheet.gridCols,
        diagramType: sheet.gridType
      });

      // Load the chords
      const loadedChords = sheet.chords.map(chord => ({
        id: chord.id,
        title: chord.title,
        numStrings: chord.numStrings,
        numFrets: chord.numFrets,
        fretNumbers: chord.fretNumbers,
        notes: chord.notes,
        openStrings: chord.openStrings
      }));

      setChords(loadedChords);

      console.log('Sheet loaded successfully:', sheet.title);
    } catch (error) {
      console.error('Error loading sheet:', error);
      setError('Failed to load sheet');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setError('');
      }, 5000);
    }
  };

  const handleExport = async () => {
    try {
      // Find the modal content that contains the preview
      const modalContent = document.querySelector('.modal-preview-content');
      if (!modalContent) {
        throw new Error('Preview content not found');
      }

      // Create safe filename from the current sheet title
      const filename = createSafeFilename(sheetTitle);

      // Generate PDF with the dynamic filename
      const success = await generatePDF(modalContent, filename);

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

  const handleNewSheet = () => {
    setCurrentSheetId(null);
    setChords([]);
    setSheetTitle("My Chord Sheet");
    setGridConfig({ rows: 4, cols: 4, diagramType: '6-fret' });
    setEditingChord(null);
    setEditingIndex(null);
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
            <div className="flex items-center gap-3">
              <AuthButton onOpenDashboard={() => setShowDashboard(true)} />
              <button
                onClick={() => setShowHelp(true)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 
                     text-gray-700 rounded-md flex items-center gap-2"
              >
                <HelpCircle size={16} />
                How to Use
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <ChordSheetControls
                gridConfig={gridConfig}
                onGridChange={handleGridChange}
                //onExport={handleExport}
                onPreview={() => setShowPreview(true)}
                onClearRequest={handleClearSheetRequest}
                onSaveSheet={handleSaveSheet}
                onNewSheet={handleNewSheet}
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



      <Modal
        isOpen={showClearConfirmation}
        onClose={handleCancelClear}
        title="Clear Chord Sheet"
        actions={
          <>
            <button
              onClick={handleCancelClear}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All Chords
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to clear all chords from this sheet?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <p className="text-yellow-800 font-medium mb-1">This action cannot be undone</p>
                <p className="text-yellow-700 text-sm">
                  You currently have {chords.length} chord{chords.length !== 1 ? 's' : ''} on your sheet.
                  All of these will be permanently removed.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Your sheet title and grid settings will be preserved.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        title="My Saved Sheets"
      >
        <Dashboard
          onLoadSheet={handleLoadSheet}
          onClose={() => setShowDashboard(false)}
        />
      </Modal>



    </div>

  );

};

export default App

