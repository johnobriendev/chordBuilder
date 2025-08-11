// src/components/ChordSheet.jsx
import React, { forwardRef } from 'react'
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2 } from 'lucide-react';

// ====================================================================
// SPACING CONFIGURATION - Controls space BETWEEN chord diagrams
// ====================================================================
const getSpacingConfig = (cols, diagramType, isPreview = false) => {
  const is12Fret = diagramType === '12-fret';

  // 1x1 and 2x2 grids (very few chords = lots of space)
  if (cols <= 2) {
    return {
      // Different spacing for preview vs chord sheet
      rowGap: isPreview
        ? (is12Fret ? '3rem' : '2rem')      // ← PREVIEW: Vertical space
        : (is12Fret ? '2rem' : '1.5rem'),   // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '4rem' : '3rem')      // ← PREVIEW: Horizontal space
        : (is12Fret ? '3rem' : '2rem'),     // ← CHORD SHEET: Horizontal space
      displaySize: 'large'
    };
  }
  // 3x3 and 4x4 grids ← YOUR 4x4 GRIDS USE THIS!
  else if (cols <= 4) {
    return {
      // Different spacing for preview vs chord sheet
      rowGap: isPreview
        ? (is12Fret ? '2rem' : '1.5rem')    // ← PREVIEW: Vertical space (smaller!)
        : (is12Fret ? '1.5rem' : '1rem'),   // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '3.5rem' : '6rem')    // ← PREVIEW: Horizontal space
        : (is12Fret ? '2.5rem' : '2rem'),   // ← CHORD SHEET: Horizontal space
      displaySize: is12Fret ? 'medium' : 'large'
    };
  }
  // 5x5 and 6x6 grids
  else if (cols <= 6) {
    return {
      rowGap: isPreview
        ? (is12Fret ? '1.5rem' : '1rem')    // ← PREVIEW: Vertical space
        : (is12Fret ? '1rem' : '0.75rem'),  // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '2.5rem' : '2rem')    // ← PREVIEW: Horizontal space
        : (is12Fret ? '2rem' : '1.5rem'),   // ← CHORD SHEET: Horizontal space
      displaySize: is12Fret ? 'small' : 'medium'
    };
  }
  // 7x7, 8x8+ grids (many chords = tight spacing)
  else {
    return {
      rowGap: isPreview
        ? (is12Fret ? '1rem' : '0.75rem')   // ← PREVIEW: Vertical space
        : (is12Fret ? '0.75rem' : '0.5rem'), // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '2rem' : '1.5rem')    // ← PREVIEW: Horizontal space
        : (is12Fret ? '1.5rem' : '1rem'),   // ← CHORD SHEET: Horizontal space
      displaySize: 'small'
    };
  }
};

// ====================================================================
// HELPER FUNCTION - Check if chord matches current grid type
// ====================================================================
const isChordCompatibleWithGrid = (chord, gridConfig) => {
  if (!chord) return true;

  const chordFrets = chord.numFrets || 6;
  const expectedType = gridConfig.diagramType || '6-fret';

  if (expectedType === '6-fret' && chordFrets === 6) return true;
  if (expectedType === '12-fret' && chordFrets === 12) return true;

  return false;
};

// ====================================================================
// MAIN CHORD SHEET COMPONENT
// ====================================================================
const ChordSheet = forwardRef(({
  id = 'chord-sheet',
  chords = [],
  gridConfig,           // Contains: {rows, cols, diagramType}
  isPreview = false,    // true = preview/PDF, false = regular sheet
  isPrinting = false,
  isInteractive = false, // true = can edit/delete chords
  setChords,
  onEditChord,
  title = "",
  onTitleChange
}, ref) => {

  // GET SPACING CONFIG based on your grid size AND preview mode
  const spacing = getSpacingConfig(gridConfig.cols, gridConfig.diagramType, isPreview);


  // ====================================================================
  // CHORD MANAGEMENT FUNCTIONS
  // ====================================================================
  const handleDeleteChord = (index) => {
    if (!isInteractive) return;
    const newChords = chords.filter((_, idx) => idx !== index);
    setChords(newChords);
  };

  // Filter chords based on compatibility with current grid type
  const getFilteredChords = () => {
    if (isPreview) {
      return chords; // Show all chords in preview
    } else {
      return chords.filter(chord => isChordCompatibleWithGrid(chord, gridConfig));
    }
  };

  // Create grid slots with chord data
  const createSlots = () => {
    const filteredChords = getFilteredChords();

    if (isInteractive) {
      // Interactive mode: create exact number of slots for grid
      const totalSlots = gridConfig.rows * gridConfig.cols;
      return Array(totalSlots).fill(null).map((_, index) => {
        const chord = filteredChords[index] || null;
        return {
          chord,
          originalIndex: chord ? chords.findIndex(c => c.id === chord.id) : -1,
          isCompatible: chord ? isChordCompatibleWithGrid(chord, gridConfig) : true
        };
      });
    } else {
      // Non-interactive mode: just show the chords we have
      return filteredChords.map((chord, index) => ({
        chord,
        originalIndex: index,
        isCompatible: isChordCompatibleWithGrid(chord, gridConfig)
      }));
    }
  };

  const slots = createSlots();

  // ====================================================================
  // MOBILE SCALING (for small screens)
  // ====================================================================
  const getMobileStyles = () => {
    if (isPreview) return {}; // No mobile scaling in preview

    const is12Fret = gridConfig.diagramType === '12-fret';
    const baseScale = window.innerWidth < 640 ? 0.9 : 1.0;
    const fretScale = is12Fret ? 0.85 : 1.0;

    return {
      padding: '0.5rem',
      transform: `scale(${baseScale * fretScale})`,
      transformOrigin: 'top left'
    };
  };

  // ====================================================================
  // TITLE RENDERING
  // ====================================================================
  const renderTitle = () => {
    if (isInteractive) {
      // Editable title input
      return (
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-2xl font-light text-gray-900 px-4 py-2 mb-4
                     border-b border-transparent hover:border-gray-200 hover:text-blue-500 focus:border-gray-300
                     focus:outline-none bg-transparent placeholder-black"
          placeholder="Enter Sheet Title"
        />
      );
    }

    // Static title display
    return (
      <h2 className={`text-2xl font-bold text-gray-900 text-center ${isPreview ? 'mb-2' : 'mb-4'}`}>
        {title}
      </h2>
    );
  };

  // ====================================================================
  // MAIN GRID CONTENT RENDERING
  // ====================================================================
  const renderContent = () => (
    <div
      style={{
        // MAIN GRID LAYOUT with separate row and column gaps
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`, // Number of columns
        rowGap: spacing.rowGap,          // ← VERTICAL SPACE BETWEEN diagrams
        columnGap: spacing.columnGap,    // ← HORIZONTAL SPACE BETWEEN diagrams
        width: '100%',
        paddingTop: isPreview ? '0.25in' : '0.5rem',        // Less top padding for PDF
        paddingLeft: isPreview ? '0.75in' : '0.5rem',      // Keep side padding for PDF  
        paddingRight: isPreview ? '0.75in' : '0.5rem',     // Keep side padding for PDF
        paddingBottom: isPreview ? '0.25in' : '0.5rem',    // Some bottom padding for PDF
        boxSizing: 'border-box',
        backgroundColor: isPreview ? 'white' : '#d6d3d1',
        ...getMobileStyles()
      }}
    >
      {slots.map((slot, index) => {
        const { chord, originalIndex, isCompatible } = slot;

        // In preview mode, skip empty slots
        if (!chord && isPreview) return null;

        return (
          <div
            key={chord ? chord.id : `empty-${index}`}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              position: 'relative'
            }}
          >
            {chord && (
              <div style={{ width: '100%', position: 'relative' }} className="group">
                {/* THE ACTUAL CHORD DIAGRAM */}
                <ChordDisplay
                  chord={chord}
                  size={spacing.displaySize}  // ← This determines which size config to use
                  isPreview={isPreview}      // ← This determines getSizeConfigs vs getMobileSizeConfigs
                />

                {/* Warning indicator for incompatible chords */}
                {isPreview && !isCompatible && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"
                    title={`This ${chord.numFrets || 6}-fret chord may not display properly in ${gridConfig.diagramType} grid`} />
                )}

                {/* Edit/Delete buttons (only in interactive mode) */}
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                                transition-opacity flex gap-1 p-1 z-10">
                    <button
                      onClick={() => onEditChord(chord, originalIndex)}
                      className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteChord(originalIndex)}
                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty slot placeholder */}
            {!chord && isInteractive && (
              <div className="text-gray-600 text-sm flex flex-col items-center">
                <span>Empty</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // ====================================================================
  // MAIN RENDER
  // ====================================================================
  return (
    <div
      ref={ref}
      id={id}
      className={!isPreview ? 'max-w-full overflow-x-auto' : ''}
      style={{
        // OVERALL SHEET CONTAINER
        width: isPreview ? '8.5in' : '100%',   // PDF vs screen width
        minHeight: isPreview ? '11in' : 'auto', // PDF vs screen height
        margin: '0',
        padding: '0',
        backgroundColor: isPreview ? 'white' : '#d6d3d1',
        overflow: isPreview ? 'hidden' : 'auto',
        boxSizing: 'border-box'
      }}
    >
      {renderTitle()}
      {renderContent()}
    </div>
  );
});

ChordSheet.displayName = 'ChordSheet';
export default ChordSheet;