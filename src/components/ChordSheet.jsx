// src/components/ChordSheet.jsx
import React, { forwardRef } from 'react'
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2 } from 'lucide-react';

// Enhanced spacing for different diagram types
const getSpacingConfig = (cols, diagramType) => {
  const is12Fret = diagramType === '12-fret';
  
  if (cols <= 2) {
    return {
      gridGap: is12Fret ? '3rem' : '2rem',
      displaySize: 'large'
    };
  } else if (cols <= 4) {
    return {
      gridGap: is12Fret ? '2.5rem' : '2rem',
      displaySize: is12Fret ? 'medium' : 'large'
    };
  } else if (cols <= 6) {
    return {
      gridGap: is12Fret ? '2rem' : '1.5rem',
      displaySize: is12Fret ? 'small' : 'medium'
    };
  } else {
    return {
      gridGap: is12Fret ? '1.5rem' : '1rem',
      displaySize: 'small'
    };
  }
};

// Helper for chord compatibility checking
const isChordCompatibleWithGrid = (chord, gridConfig) => {
  if (!chord) return true;
  
  const chordFrets = chord.numFrets || 6;
  const expectedType = gridConfig.diagramType || '6-fret';
  
  if (expectedType === '6-fret' && chordFrets === 6) return true;
  if (expectedType === '12-fret' && chordFrets === 12) return true;
  
  return false;
};

const ChordSheet = forwardRef(({ 
  id = 'chord-sheet',
  chords = [], 
  gridConfig, 
  isPreview = false,
  isPrinting = false, 
  isInteractive = false,
  setChords,
  onEditChord,
  title = "",
  onTitleChange
}, ref) => {

  const spacing = getSpacingConfig(gridConfig.cols, gridConfig.diagramType);

  const handleDeleteChord = (index) => {
    if (!isInteractive) return;
    const newChords = chords.filter((_, idx) => idx !== index);
    setChords(newChords);
  };

  // Filter chords based on compatibility
  const getFilteredChords = () => {
    if (isPreview) {
      return chords; // Show all in preview
    } else {
      return chords.filter(chord => isChordCompatibleWithGrid(chord, gridConfig));
    }
  };

  // Create slots with original indices for editing
  const createSlots = () => {
    const filteredChords = getFilteredChords();
    
    if (isInteractive) {
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
      return filteredChords.map((chord, index) => ({
        chord,
        originalIndex: index,
        isCompatible: isChordCompatibleWithGrid(chord, gridConfig)
      }));
    }
  };

  const slots = createSlots();

  const getMobileStyles = () => {
    if (isPreview) return {};
    
    const is12Fret = gridConfig.diagramType === '12-fret';
    const baseScale = window.innerWidth < 640 ? 0.9 : 1.0;
    const fretScale = is12Fret ? 0.85 : 1.0;
    
    return {
      padding: '0.5rem',
      transform: `scale(${baseScale * fretScale})`,
      transformOrigin: 'top left'
    };
  };

  const renderTitle = () => {
    if (isInteractive) {
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
    
    return (
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        {title}
      </h2>
    );
  };

  const renderContent = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
        gap: spacing.gridGap,
        width: '100%',
        padding: isPreview ? '0.75in' : '0.5rem',
        boxSizing: 'border-box',
        backgroundColor: isPreview ? 'white' : '#d6d3d1',
        ...getMobileStyles()
      }}
    >
      {slots.map((slot, index) => {
        const { chord, originalIndex, isCompatible } = slot;
        
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
                <ChordDisplay 
                  chord={chord} 
                  size={spacing.displaySize} 
                  isPreview={isPreview} 
                />
                
                {isPreview && !isCompatible && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600" 
                       title={`This ${chord.numFrets || 6}-fret chord may not display properly in ${gridConfig.diagramType} grid`} />
                )}
                
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

  return (
    <div 
      ref={ref}
      id={id}
      className={!isPreview ? 'max-w-full overflow-x-auto' : ''}
      style={{
        width: isPreview ? '8.5in' : '100%',  
        minHeight: isPreview ? '11in' : 'auto', 
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