import React, {useState, useEffect} from 'react';
import { Trash2, Plus, Save, Guitar } from 'lucide-react';

const GuitarDiagram = ({ onAddToSheet = () => {}, initialChord = null }) => {
  // Dynamic fret count - this is the key change that enables 12-fret diagrams
  const [numStrings, setNumStrings] = useState(6);
  const [numFrets, setNumFrets] = useState(6); // New state for fret count

  // State for tracking note positions and chord name and fret number
  const [notes, setNotes] = useState(new Set());
  const [openStrings, setOpenStrings] = useState(new Set());
  const [title, setTitle] = useState('');
  const [fretNumbers, setFretNumbers] = useState(Array(6).fill('')); // Will be dynamic

  // Reset states when changing number of strings OR frets
  useEffect(() => {
    // Clear all notes and open strings when switching string count or fret count
    setNotes(new Set());
    setOpenStrings(new Set());
    setTitle('');
    // Create new fret numbers array based on current fret count
    setFretNumbers(Array(numFrets).fill(''));
  }, [numStrings, numFrets]); // Added numFrets to dependency array

  // Update fret numbers array when numFrets changes
  useEffect(() => {
    setFretNumbers(Array(numFrets).fill(''));
  }, [numFrets]);

  // Initialize the component when initialChord changes
  useEffect(() => {
    if (initialChord) {
      // Initialize notes - convert array of note IDs back to Set
      setNotes(new Set(initialChord.notes));
      
      // Initialize open strings - convert array back to Set
      setOpenStrings(new Set(initialChord.openStrings));
      
      // Initialize title
      setTitle(initialChord.title);
      
      // Initialize fret numbers - but respect the stored fret count
      setNumFrets(initialChord.numFrets || 6); // Default to 6 if not specified
      setFretNumbers(initialChord.fretNumbers || Array(initialChord.numFrets || 6).fill(''));
      
      // Set number of strings
      setNumStrings(initialChord.numStrings || 6);
    }
  }, [initialChord]); 

  // Create a unique string identifier for each note position
  const createNoteId = (string, fret) => `${string}-${fret}`;
  const createOpenStringId = (string) => `open-${string}`;

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

  const toggleOpenString = (string) => {
    const openStringId = createOpenStringId(string);
    const newOpenStrings = new Set(openStrings);
    
    if (newOpenStrings.has(openStringId)) {
      newOpenStrings.delete(openStringId);
    } else {
      newOpenStrings.add(openStringId);
    }
    
    setOpenStrings(newOpenStrings);
  };

  const clearDiagram = () => {
    setNotes(new Set());
    setOpenStrings(new Set());
    setTitle('');
    setFretNumbers(Array(numFrets).fill(''));
  };

  const handleFretNumberChange = (index, value) => {
    const newFretNumbers = [...fretNumbers];
    // Allow empty string or numbers
    newFretNumbers[index] = value === '' ? '' : parseInt(value) || '';
    setFretNumbers(newFretNumbers);
  };

  const handleSubmit = () => {
    onAddToSheet({
      title,
      fretNumbers,
      notes: Array.from(notes),
      openStrings: Array.from(openStrings),
      id: initialChord ? initialChord.id : Date.now(),
      numStrings,
      numFrets // Include the fret count in the chord data
    });
    clearDiagram();
  };

  // Calculate the height dynamically based on fret count
  // 6 frets = 28rem, 12 frets should be proportionally taller
  const diagramHeight = `${(28 * numFrets) / 6}rem`;

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {/* Controls section with both string and fret selection */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Guitar size={20} className="text-gray-600" />
          <select
            value={numStrings}
            onChange={(e) => setNumStrings(Number(e.target.value))}
            className="px-3 py-2 border rounded-md text-gray-700 text-sm"
          >
            <option value={6}>6 Strings</option>
            <option value={4}>4 Strings</option>
          </select>
        </div>
        
        {/* New fret count selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Frets:</span>
          <select
            value={numFrets}
            onChange={(e) => setNumFrets(Number(e.target.value))}
            className="px-3 py-2 border rounded-md text-gray-700 text-sm"
          >
            <option value={6}>6 Frets</option>
            <option value={12}>12 Frets</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Chord or Scale name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded bg-slate-300 placeholder-black"
        />
      </div>

      <div className="relative border-2 border-slate-500 rounded p-6">
        <div className="relative w-64 mx-auto" style={{ height: diagramHeight }}>
          {/* Open string positions */}
          <div className="absolute w-full" style={{ top: '-24px' }}>
            {[...Array(numStrings)].map((_, stringIndex) => (
              <div
                key={`open-${stringIndex}`}
                className="absolute w-6 h-6 -ml-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
                style={{ left: `${(stringIndex * 100) / (numStrings - 1)}%` }}
                onClick={() => toggleOpenString(stringIndex)}
              >
                {openStrings.has(createOpenStringId(stringIndex)) && (
                  <div className="w-4 h-4 border-2 border-blue-500 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Fret numbers on the left - now dynamically generated */}
          <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col justify-between">
            {[...Array(numFrets)].map((_, index) => (
              <div key={`fret-number-${index}`} className="relative flex-1 flex items-center">
                <input
                  type="number"
                  value={fretNumbers[index]}
                  onChange={(e) => handleFretNumberChange(index, e.target.value)}
                  className="w-10 p-1 text-sm border rounded bg-slate-300 placeholder-black"
                  placeholder="#"
                />
              </div>
            ))}
          </div>

          {/* Fret lines - now dynamically generated based on numFrets */}
          {[...Array(numFrets + 1)].map((_, index) => (
            <div
              key={`fret-${index}`}
              className="absolute w-full h-px bg-slate-600"
              style={{ top: `${(index * 100) / numFrets}%` }}
            />
          ))}
          
          {/* Strings - unchanged since this depends on numStrings */}
          {[...Array(numStrings)].map((_, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="absolute top-0 bottom-0 w-px bg-slate-600"
              style={{ left: `${(stringIndex * 100) / (numStrings - 1)}%` }}
            />
          ))}

          {/* Note positions - now dynamically calculated based on numFrets */}
          {[...Array(numStrings)].map((_, stringIndex) => (
            <React.Fragment key={`string-positions-${stringIndex}`}>
              {[...Array(numFrets)].map((_, fretIndex) => (
                <div
                  key={`position-${stringIndex}-${fretIndex}`}
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full"
                  style={{
                    left: `${(stringIndex * 100) / (numStrings - 1)}%`,
                    top: `${((fretIndex * 100) / numFrets) + (100 / (numFrets * 2))}%`
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
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {initialChord ? (
            <>
              <Save size={16} /> Save Changes
            </>
          ) : (
            <>
              <Plus size={16} /> Add to Sheet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GuitarDiagram;