import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';
import ChordSheet from './components/ChordSheet';


function App() {
  // State to manage the collection of chords
  const [chords, setChords] = useState([]);


  // Handler for adding new chords to the sheet
  const handleAddChord = (chordData) => {
    setChords(prevChords => [...prevChords, chordData]);
    console.log('New chord added:', chordData); 
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
          <section className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chord Sheet</h2>
              <ChordSheet chords={chords} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
 
};

export default App
