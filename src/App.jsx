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
      <header className="bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Guitar Chord Creator</h1>
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
                <h2 className="text-xl font-semibold mb-4">Create New Chord</h2>
                <GuitarDiagram 
                  onAddToSheet={handleAddChord}
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </section>
          </div>

          {/* Right column - Chord Sheet */}
          <div className="flex-grow">
            <section className="bg-white shadow-lg rounded-lg">
              <ChordSheet 
                chords={chords} 
                gridConfig={gridConfig}
              />
            </section>
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



// <div className="min-h-screen bg-gray-50">
     
// <header className="bg-white shadow-sm">
//   <div className="max-w-7xl mx-auto px-4 py-4">
//     <h1 className="text-2xl font-bold text-gray-900">Guitar Chord Creator</h1>
//   </div>
// </header>


// <main className="max-w-7xl mx-auto px-4 py-6">
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//     
//     <section className="bg-white rounded-lg shadow">
//       <div className="p-6">
//         <h2 className="text-xl font-semibold mb-4">Create New Chord</h2>
//         <GuitarDiagram onAddToSheet={handleAddChord} />
//       </div>
//     </section>

    
//     <section>
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold mb-4">Chord Sheet</h2>
//         <div className="bg-white rounded-lg shadow p-4">
//           <ChordSheetControls 
//             gridConfig={gridConfig}
//             onGridChange={handleGridChange}
//             onExport={handleExport}
//           />
//         </div>
//       </div>
      
      
//       <div className="bg-white shadow-lg rounded-lg">
//         <ChordSheet 
//           chords={chords} 
//           gridConfig={gridConfig}
//         />
//       </div>
//     </section>
//   </div>
// </main>
// </div> */}