import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordSheet from './components/ChordSheet';
import ChordSheetControls from './components/ChordSheetControls';


function App() {
  // State to manage the collection of chords
  const [chords, setChords] = useState([]);
  const [gridConfig, setGridConfig] = useState({ rows: 4, cols: 4 });

  // Handler for adding new chords to the sheet
  const handleAddChord = (chordData) => {
    setChords(prevChords => [...prevChords, chordData]);
    console.log('New chord added:', chordData); 
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
      {/* Header section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Guitar Chord Creator</h1>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chord Creator */}
          <section className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Chord</h2>
              <GuitarDiagram onAddToSheet={handleAddChord} />
            </div>
          </section>

          {/* Chord Sheet Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Chord Sheet</h2>
              <div className="bg-white rounded-lg shadow p-4">
                <ChordSheetControls 
                  gridConfig={gridConfig}
                  onGridChange={handleGridChange}
                  onExport={handleExport}
                />
              </div>
            </div>
            
            {/* Separate white paper-like section for the chord sheet */}
            <div className="bg-white shadow-lg rounded-lg">
              <ChordSheet 
                chords={chords} 
                gridConfig={gridConfig}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
 
};

export default App
