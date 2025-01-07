import React, {useState} from 'react';

const GuitarDiagram = () => {
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  // State for tracking note positions
  const [notes, setNotes] = useState(new Set());
  
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


  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="relative border-2 border-gray-300 rounded p-4">
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
    </div>
  );
};

export default GuitarDiagram;