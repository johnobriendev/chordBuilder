import React, { useState } from 'react';
import GuitarDiagram from './components/GuitarDiagram';



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

          {/* Placeholder for Chord Sheet */}
          <section className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chord Sheet</h2>
              {chords.length === 0 ? (
                <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Add some chords to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chords.map(chord => (
                    <div key={chord.id} className="p-4 border rounded">
                      <h3 className="font-medium">{chord.title || 'Untitled Chord'}</h3>
                      <p className="text-sm text-gray-600">
                        Starting Fret: {chord.startingFret}
                      </p>
                      <p className="text-sm text-gray-600">
                        Notes: {chord.notes.length}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
 
};

export default App
