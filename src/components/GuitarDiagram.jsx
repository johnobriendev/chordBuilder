import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Guitar, X, Triangle, Square } from 'lucide-react';

const GuitarDiagram = ({ onAddToSheet = () => { }, initialChord = null }) => {
  // Dynamic fret count - this is the key change that enables 12-fret diagrams
  const [numStrings, setNumStrings] = useState(6);
  const [numFrets, setNumFrets] = useState(6); // New state for fret count

  // State for tracking note positions and chord name and fret number
  const [notes, setNotes] = useState(new Set());
  const [openStrings, setOpenStrings] = useState(new Set());
  const [rootNotes, setRootNotes] = useState(new Set());
  const [title, setTitle] = useState('');
  const [fretNumbers, setFretNumbers] = useState(Array(6).fill(''));


  const [xMarks, setXMarks] = useState(new Set());
  const [triangles, setTriangles] = useState(new Set());
  const [squares, setSquares] = useState(new Set());

  // NEW: Mode state - expanded to include symbol modes
  const [currentMode, setCurrentMode] = useState('normal'); // normal, root, x, triangle, square


  // Reset states when changing number of strings OR frets
  useEffect(() => {
    // Clear all notes and open strings when switching string count or fret count
    setNotes(new Set());
    setOpenStrings(new Set());
    setTitle('');
    // Create new fret numbers array based on current fret count
    setFretNumbers(Array(numFrets).fill(''));
    setRootNotes(new Set());

    setXMarks(new Set());
    setTriangles(new Set());
    setSquares(new Set());
    setCurrentMode('normal');
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

      // INITIALIZE ROOT NOTE
      setRootNotes(new Set(initialChord.rootNotes || []));
      setXMarks(new Set(initialChord.xMarks || []));
      setTriangles(new Set(initialChord.triangles || []));
      setSquares(new Set(initialChord.squares || []));

      setCurrentMode('normal');
    }
  }, [initialChord]);

  // Create a unique string identifier for each note position
  const createNoteId = (string, fret) => `${string}-${fret}`;
  const createOpenStringId = (string) => `open-${string}`;

  // Toggle note at the clicked position
  const toggleNote = (string, fret) => {
    const noteId = createNoteId(string, fret);

    switch (currentMode) {
      case 'normal':
        // Normal mode: Add/remove regular notes
        if (rootNotes.has(noteId)) {
          // Clicking on a root note in normal mode: convert to regular note
          const newRootNotes = new Set(rootNotes);
          newRootNotes.delete(noteId); // Remove from root notes
          setRootNotes(newRootNotes);

          const newNotes = new Set(notes);
          newNotes.add(noteId); // Add as regular note
          setNotes(newNotes);
        } else {
          // Regular toggle for normal notes
          const newNotes = new Set(notes);
          if (newNotes.has(noteId)) {
            newNotes.delete(noteId);
          } else {
            newNotes.add(noteId);
          }
          setNotes(newNotes);
        }
        break;

      case 'root':
        // Root mode: Add/remove root note
        const newRootNotes = new Set(rootNotes);
        if (newRootNotes.has(noteId)) {
          // Clicking existing root note removes it
          newRootNotes.delete(noteId);
        } else {
          // Add new root note and remove any regular note at this position
          const newNotes = new Set(notes);
          newNotes.delete(noteId); // Remove regular note if it exists
          setNotes(newNotes);
          newRootNotes.add(noteId); // Add as root
        }
        setRootNotes(newRootNotes);
        break;

      case 'x':
        // X mode: Add/remove X marks
        const newXMarks = new Set(xMarks);
        if (newXMarks.has(noteId)) {
          newXMarks.delete(noteId);
        } else {
          newXMarks.add(noteId);
        }
        setXMarks(newXMarks);
        break;

      case 'triangle':
        // Triangle mode: Add/remove triangles
        const newTriangles = new Set(triangles);
        if (newTriangles.has(noteId)) {
          newTriangles.delete(noteId);
        } else {
          newTriangles.add(noteId);
        }
        setTriangles(newTriangles);
        break;

      case 'square':
        // Square mode: Add/remove squares
        const newSquares = new Set(squares);
        if (newSquares.has(noteId)) {
          newSquares.delete(noteId);
        } else {
          newSquares.add(noteId);
        }
        setSquares(newSquares);
        break;
    }
  };

  // Updated toggle open string function to handle all modes
  const toggleOpenString = (string) => {
    const openStringId = createOpenStringId(string);

    switch (currentMode) {
      case 'normal':
        // Normal mode: Add/remove open strings
        if (rootNotes.has(openStringId)) {
          // Clicking on a root open string in normal mode: convert to regular open string
          const newRootNotes = new Set(rootNotes);
          newRootNotes.delete(openStringId); // Remove from root notes
          setRootNotes(newRootNotes);
          // Keep it as an open string (don't remove from openStrings)
        } else {
          // Regular toggle for open strings
          const newOpenStrings = new Set(openStrings);
          if (newOpenStrings.has(openStringId)) {
            newOpenStrings.delete(openStringId);
          } else {
            newOpenStrings.add(openStringId);
          }
          setOpenStrings(newOpenStrings);
        }
        break;

      case 'root':
        // Root mode: Add/remove root note for open string
        const newRootNotes = new Set(rootNotes);
        if (newRootNotes.has(openStringId)) {
          // Clicking existing root note removes it
          newRootNotes.delete(openStringId);
        } else {
          // Add new root note - ensure the open string is also in openStrings set
          newRootNotes.add(openStringId);
          const newOpenStrings = new Set(openStrings);
          newOpenStrings.add(openStringId);
          setOpenStrings(newOpenStrings);
        }
        setRootNotes(newRootNotes);
        break;

      case 'x':
        // X mode: Add/remove X marks on open strings
        const newXMarks = new Set(xMarks);
        if (newXMarks.has(openStringId)) {
          newXMarks.delete(openStringId);
        } else {
          newXMarks.add(openStringId);
        }
        setXMarks(newXMarks);
        break;

      case 'triangle':
        // Triangle mode: Add/remove triangles on open strings
        const newTriangles = new Set(triangles);
        if (newTriangles.has(openStringId)) {
          newTriangles.delete(openStringId);
        } else {
          newTriangles.add(openStringId);
        }
        setTriangles(newTriangles);
        break;

      case 'square':
        // Square mode: Add/remove squares on open strings
        const newSquares = new Set(squares);
        if (newSquares.has(openStringId)) {
          newSquares.delete(openStringId);
        } else {
          newSquares.add(openStringId);
        }
        setSquares(newSquares);
        break;
    }
  };

  const clearDiagram = () => {
    setNotes(new Set());
    setOpenStrings(new Set());
    setTitle('');
    setFretNumbers(Array(numFrets).fill(''));
    setRootNotes(new Set());
    setXMarks(new Set());
    setTriangles(new Set());
    setSquares(new Set());
    setCurrentMode('normal');
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
      rootNotes: Array.from(rootNotes),
      xMarks: Array.from(xMarks),
      triangles: Array.from(triangles),
      squares: Array.from(squares),
      id: initialChord ? initialChord.id : Date.now(),
      numStrings,
      numFrets // Include the fret count in the chord data
    });
    clearDiagram();
  };

  // Helper function to check if a position is the root note
  const isRootNote = (string, fret, isOpen = false) => {
    const noteId = isOpen ? createOpenStringId(string) : createNoteId(string, fret);
    return rootNotes.has(noteId);
  };

  const hasXMark = (string, fret, isOpen = false) => {
    const noteId = isOpen ? createOpenStringId(string) : createNoteId(string, fret);
    return xMarks.has(noteId);
  };

  const hasTriangle = (string, fret, isOpen = false) => {
    const noteId = isOpen ? createOpenStringId(string) : createNoteId(string, fret);
    return triangles.has(noteId);
  };

  const hasSquare = (string, fret, isOpen = false) => {
    const noteId = isOpen ? createOpenStringId(string) : createNoteId(string, fret);
    return squares.has(noteId);
  };

  // Calculate the height dynamically based on fret count
  // 6 frets = 20rem, 12 frets should be proportionally taller was 28rem
  const diagramHeight = `${(20 * numFrets) / 6}rem`;

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      {/* Controls section with both string and fret selection */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Guitar size={18} className="text-gray-600" />
          <select
            value={numStrings}
            onChange={(e) => setNumStrings(Number(e.target.value))}
            className="px-2.5 py-1.5 border rounded-md text-gray-700 text-sm"
          >
            <option value={6}>6 Strings</option>
            <option value={4}>4 Strings</option>
          </select>
        </div>
        
        {/* Fret count selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Frets:</span>
          <select
            value={numFrets}
            onChange={(e) => setNumFrets(Number(e.target.value))}
            className="px-2.5 py-1.5 border rounded-md text-gray-700 text-sm"
          >
            <option value={6}>6 Frets</option>
            <option value={12}>12 Frets</option>
          </select>
        </div>
      </div>

      {/* NEW: Mode selection buttons */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentMode('normal')}
          className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
            currentMode === 'normal'
              ? 'bg-secondary text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-gray-200'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setCurrentMode('root')}
          className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
            currentMode === 'root'
              ? 'bg-primary text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-gray-200'
          }`}
        >
          Root
        </button>
        <button
          onClick={() => setCurrentMode('x')}
          className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
            currentMode === 'x'
              ? 'bg-red-500 text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-gray-200'
          }`}
        >
          <X size={14} />
          X Mark
        </button>
        <button
          onClick={() => setCurrentMode('triangle')}
          className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
            currentMode === 'triangle'
              ? 'bg-green-500 text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-gray-200'
          }`}
        >
          <Triangle size={14} />
          Triangle
        </button>
        <button
          onClick={() => setCurrentMode('square')}
          className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
            currentMode === 'square'
              ? 'bg-purple-500 text-white'
              : 'bg-surface-alt text-text-secondary hover:bg-gray-200'
          }`}
        >
          <Square size={14} />
          Square
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter Chord or Scale name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border-2 border-secondary rounded-lg bg-white placeholder-text-secondary placeholder-opacity-50 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="relative border-2 border-slate-500 rounded p-8 sm:p-12 overflow-visible">
        <div className="relative w-56 sm:w-64 mx-auto" style={{ height: diagramHeight }}>
          {/* Open string positions */}
          <div className="absolute w-full" style={{ top: '-28px' }}>
            {[...Array(numStrings)].map((_, stringIndex) => (
              <div
                key={`open-${stringIndex}`}
                className="absolute w-6 h-6 -ml-3 flex items-center justify-center cursor-pointer hover:bg-blue-100 rounded-full"
                style={{ left: `${(stringIndex * 100) / (numStrings - 1)}%` }}
                onClick={() => toggleOpenString(stringIndex)}
              >
                {/* Base note/open string */}
                {openStrings.has(createOpenStringId(stringIndex)) && (
                  <>
                    {isRootNote(stringIndex, null, true) ? (
                      <div className="w-4 h-4 border-2 border-blue-500 rounded-full" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-black rounded-full" />
                    )}
                  </>
                )}
                
                {/* NEW: Symbols for open strings */}
                {hasTriangle(stringIndex, null, true) && (
                  <div className="absolute"
                       style={{ 
                         transform: 'translate(-50%, -55%)',
                         top: '50%',
                         left: '50%'
                       }}>
                    <Triangle size={36} className="text-black" fill="none" stroke="currentColor" strokeWidth="1" />
                  </div>
                )}
                
                {hasSquare(stringIndex, null, true) && (
                  <div className="absolute w-9 h-9 border-2 border-black"
                       style={{ 
                         transform: 'translate(-50%, -50%)',
                         top: '50%',
                         left: '50%'
                       }} />
                )}
                
                {hasXMark(stringIndex, null, true) && (
                  <div className="absolute text-black font-thin text-5xl"
                       style={{ 
                         transform: 'translate(-50%, -55%)',
                         top: '50%',
                         left: '50%'
                       }}>
                    ×
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fret numbers on the left - now dynamically generated */}
          <div className="absolute -left-11 sm:-left-14 top-0 bottom-0 w-9 sm:w-10 flex flex-col justify-between py-1">
            {[...Array(numFrets)].map((_, index) => (
              <div key={`fret-number-${index}`} className="relative flex-1 flex items-center">
                <input
                  type="number"
                  value={fretNumbers[index]}
                  onChange={(e) => handleFretNumberChange(index, e.target.value)}
                  className="w-8 sm:w-9 px-1 py-0.5 text-xs sm:text-sm border-2 border-secondary rounded bg-white text-text-primary placeholder-text-secondary font-medium focus:border-primary focus:outline-none transition-colors"
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

          {/* Note positions - now dynamically calculated based on numFrets with symbols */}
          {[...Array(numStrings)].map((_, stringIndex) => (
            <React.Fragment key={`string-positions-${stringIndex}`}>
              {[...Array(numFrets)].map((_, fretIndex) => (
                <div
                  key={`position-${stringIndex}-${fretIndex}`}
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center cursor-pointer hover:bg-blue-100 rounded-full"
                  style={{
                    left: `${(stringIndex * 100) / (numStrings - 1)}%`,
                    top: `${((fretIndex * 100) / numFrets) + (100 / (numFrets * 2))}%`
                  }}
                  onClick={() => toggleNote(stringIndex, fretIndex)}
                >
                  {/* Base note */}
                  {(notes.has(createNoteId(stringIndex, fretIndex)) || isRootNote(stringIndex, fretIndex)) && (
                    <div className={`w-4 h-4 rounded-full ${
                      isRootNote(stringIndex, fretIndex) ? 'bg-blue-500' : 'bg-black'
                    }`} />
                  )}
                  
                  {/* NEW: Symbols */}
                  {hasTriangle(stringIndex, fretIndex) && (
                    <div className="absolute"
                         style={{ 
                           transform: 'translate(-50%, -55%)',
                           top: '50%',
                           left: '50%'
                         }}>
                      <Triangle size={36} className="text-black" fill="none" stroke="currentColor" strokeWidth="1" />
                    </div>
                  )}

                  {hasSquare(stringIndex, fretIndex) && (
                    <div className="absolute w-9 h-9 border-2 border-black"
                         style={{ 
                           transform: 'translate(-50%, -50%)',
                           top: '50%',
                           left: '50%'
                         }} />
                  )}
                  
                  {hasXMark(stringIndex, fretIndex) && (
                    <div className="absolute text-black font-thin text-6xl"
                         style={{ 
                           transform: 'translate(-50%, -55%)',
                           top: '50%',
                           left: '50%'
                         }}>
                      ×
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={clearDiagram}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors"
        >
          <Trash2 size={16} /> Clear
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
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