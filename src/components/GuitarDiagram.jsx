import React, {useState} from 'react';
import { Trash2, Plus } from 'lucide-react';

const GuitarDiagram = () => {
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  // State for tracking note positions and chord name and fret number
  const [notes, setNotes] = useState(new Set());
  const [title, setTitle] = useState('');
  const [startingFret, setStartingFret] = useState(1);
  
  // Create a unique string identifier for each note position
  const createNoteId = (string, fret) => `${string}-${fret}`;
  
  // Toggle note at the clicked position
  const toggleNote = (string, fret) => {
    const noteId = createNoteId(string, fret);
    const newNotes = new Set(notes);
    
    if (newNotes.has(noteId)) {
      newNotes.delete(noteId);
    } else {
      newNotes.add(noteId);
    }
    
    setNotes(newNotes);
  };


  const clearDiagram = () => {
    setNotes(new Set());
    setTitle('');
    setStartingFret(1);
  };

  const handleStartingFretChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setStartingFret(Math.max(1, Math.min(24, value)));
  };


  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="mb-4 space-y-4">
        <input
          type="text"
          placeholder="Diagram Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap">
            Starting Fret:
            <input
              type="number"
              min="1"
              max="24"
              value={startingFret}
              onChange={handleStartingFretChange}
              className="w-20 p-2 border rounded ml-2"
            />
          </label>
        </div>
      </div>

      <div className="relative border-2 border-gray-300 rounded p-4">
        {startingFret > 1 && (
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-lg font-bold">
              {startingFret}
            </div>
        )}
        <div className="relative h-[32rem] w-64 mx-auto">
          {/* Fret lines (horizontal) */}
          {[...Array(NUM_FRETS + 1)].map((_, index) => (
            <div
              key={`fret-${index}`}
              className="absolute w-full h-px bg-gray-400"
              style={{ top: `${(index * 100) / NUM_FRETS}%` }}
            />
          ))}
          
          {/* Strings (vertical) */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="absolute top-0 bottom-0 w-px bg-gray-400"
              style={{ left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%` }}
            />
          ))}

          {/* Note positions */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <React.Fragment key={`string-positions-${stringIndex}`}>
              {[...Array(NUM_FRETS)].map((_, fretIndex) => (
                <div
                  key={`position-${stringIndex}-${fretIndex}`}
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
                  style={{
                    left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%`,
                    top: `${((fretIndex * 100) / NUM_FRETS) + (100 / (NUM_FRETS * 2))}%`
                  }}
                  onClick={() => toggleNote(stringIndex, fretIndex)}
                >
                  {notes.has(createNoteId(stringIndex, fretIndex)) && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={clearDiagram}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <Trash2 size={16} /> Clear
        </button>
        <button
          onClick={() => {
            if (onAddToSheet) {
              onAddToSheet({
                title,
                startingFret,
                notes: Array.from(notes),
                id: Date.now()
              });
              clearDiagram();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Plus size={16} /> Add to Sheet
        </button>
      </div>


    </div>
  );
};

export default GuitarDiagram;