// src/components/ChordSheet.jsx
import React, { forwardRef } from 'react'
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2, Copy } from 'lucide-react';

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
        : (is12Fret ? '2.5rem' : '3rem'),   // ← CHORD SHEET: Horizontal space (increased for fret numbers)
      displaySize: is12Fret ? 'medium' : 'large'
    };
  }
  // 5x5 and 6x6 grids
  else if (cols <= 6) {
    return {
      rowGap: isPreview
        ? (is12Fret ? '1.5rem' : '0rem')    // ← PREVIEW: Vertical space
        : (is12Fret ? '1rem' : '0.75rem'),  // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '2.5rem' : '8rem')    // ← PREVIEW: Horizontal space
        : (is12Fret ? '2rem' : '0rem'),   // ← CHORD SHEET: Horizontal space
      displaySize: is12Fret ? 'small' : 'medium'
    };
  }
  // 7x7, 8x8+ grids (many chords = tight spacing)
  else {
    return {
      rowGap: isPreview
        ? (is12Fret ? '1rem' : '0rem')   // ← PREVIEW: Vertical space
        : (is12Fret ? '0.75rem' : '0.5rem'), // ← CHORD SHEET: Vertical space
      columnGap: isPreview
        ? (is12Fret ? '2rem' : '1.5rem')    // ← PREVIEW: Horizontal space
        : (is12Fret ? '1.5rem' : '1.5rem'),   // ← CHORD SHEET: Horizontal space (increased for fret numbers)
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
  onCopyChord,
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

    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;

    if (!isMobile) return {};

    // For mobile, maintain proper spacing between chords
    // Don't compress the layout - let it scroll horizontally instead
    return {
      padding: '0.5rem',
      // Maintain generous spacing on mobile so chords don't overlap
      rowGap: '2rem',
      columnGap: '2rem',
      minWidth: 'fit-content' // Allow grid to expand beyond container width
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
          className="w-full text-2xl font-light text-text-primary px-4 py-2 mb-4
                     border-b border-transparent hover:border-border hover:text-primary focus:border-border
                     focus:outline-none bg-transparent placeholder-text-secondary placeholder-opacity-50 transition-colors"
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
  const renderContent = () => {
    const mobileStyles = getMobileStyles();
    const isMobile = Object.keys(mobileStyles).length > 0;

    return (
      <div
        style={{
          // MAIN GRID LAYOUT with separate row and column gaps
          display: 'grid',
          // On mobile, use fixed width columns to prevent compression
          gridTemplateColumns: isMobile
            ? `repeat(${gridConfig.cols}, minmax(150px, 1fr))`
            : `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
          rowGap: mobileStyles.rowGap || spacing.rowGap,
          columnGap: mobileStyles.columnGap || spacing.columnGap,
          width: isMobile ? mobileStyles.minWidth : '100%',
          // GRID-SPECIFIC PADDING FOR PDF
          paddingTop: isPreview
            ? (gridConfig.cols <= 4 ? '0.25in' : gridConfig.cols <= 6 ? '0.1in' : '0.05in')
            : (isMobile ? '0.5rem' : '1rem'),
          paddingLeft: isPreview
            ? (gridConfig.cols <= 4 ? '0.75in' : gridConfig.cols <= 6 ? '0.75in' : '0.25in')
            : (isMobile ? '0.5rem' : (gridConfig.cols <= 4 ? '1rem' : gridConfig.cols <= 6 ? '1.5rem' : '0.75rem')),
          paddingRight: isPreview
            ? (gridConfig.cols <= 4 ? '0.75in' : gridConfig.cols <= 6 ? '0.75in' : '0.25in')
            : (isMobile ? '0.5rem' : (gridConfig.cols <= 4 ? '1rem' : gridConfig.cols <= 6 ? '1.5rem' : '0.75rem')),
          paddingBottom: isPreview
            ? (gridConfig.cols <= 4 ? '0.25in' : gridConfig.cols <= 6 ? '0.1in' : '0.05in')
            : (isMobile ? '0.5rem' : '1rem'),
          boxSizing: 'border-box',
          backgroundColor: isPreview ? 'white' : '#ffffff'
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
                  size={spacing.displaySize}
                  isPreview={isPreview}
                />

                {/* Warning indicator for incompatible chords */}
                {isPreview && !isCompatible && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"
                    title={`This ${chord.numFrets || 6}-fret chord may not display properly in ${gridConfig.diagramType} grid`} />
                )}

                {/* Edit/Copy/Delete buttons (only in interactive mode) */}
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100
                                transition-opacity flex gap-1 p-1 z-10">
                    <button
                      onClick={() => onEditChord(chord, originalIndex)}
                      className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none transition-colors shadow-sm"
                      title="Edit chord"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onCopyChord(chord)}
                      className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-colors shadow-sm"
                      title="Copy chord"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteChord(originalIndex)}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition-colors shadow-sm"
                      title="Delete chord"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty slot placeholder */}
            {!chord && isInteractive && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Empty</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
    );
  };

  // ====================================================================
  // MAIN RENDER
  // ====================================================================
  const isMobile = window.innerWidth < 768;

  return (
    <div
      ref={ref}
      id={id}
      className={!isPreview ? 'max-w-full' : ''}
      style={{
        // OVERALL SHEET CONTAINER
        width: isPreview ? '8.5in' : '100%',   // PDF vs screen width
        minHeight: isPreview ? '11in' : 'auto', // PDF vs screen height
        maxHeight: isPreview ? 'none' : (isMobile ? 'calc(100vh - 250px)' : 'none'),
        margin: '0',
        padding: isPreview ? '0' : (isMobile ? '0.75rem' : '1.5rem'),
        backgroundColor: isPreview ? 'white' : '#ffffff',
        // Enable both horizontal and vertical scrolling on mobile
        overflow: isPreview ? 'hidden' : (isMobile ? 'auto' : 'auto'),
        overflowX: isPreview ? 'hidden' : (isMobile ? 'scroll' : 'auto'),
        overflowY: isPreview ? 'hidden' : (isMobile ? 'scroll' : 'auto'),
        boxSizing: 'border-box',
        borderRadius: isPreview ? '0' : '0.75rem',
        border: isPreview ? 'none' : '1px solid #aecbeb',
        boxShadow: isPreview ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.06)',
        // Smooth scrolling for better UX
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {renderTitle()}
      {renderContent()}
    </div>
  );
});

ChordSheet.displayName = 'ChordSheet';
export default ChordSheet;