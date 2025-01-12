// src/components/ChordSheet.jsx
import React, { forwardRef } from 'react'
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2 } from 'lucide-react';

// We'll use more precise spacing for different grid sizes
const getSpacingConfig = (cols) => {
  if (cols <= 4) {
    return {
      gridGap: '2rem',    // 32px gap between chords
      displaySize: 'large'
    };
  } else if (cols <= 6) {
    return {
      gridGap: '1.5rem',  // 24px gap between chords
      displaySize: 'medium'
    };
  } else {
    return {
      gridGap: '1rem',    // 16px gap between chords
      displaySize: 'small'
    };
  }
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

  // Get spacing configuration based on grid size
  const spacing = getSpacingConfig(gridConfig.cols);


  const renderTitle = () => {
    if (isInteractive) {
      return (
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-2xl font-bold text-gray-900 px-4 py-2 mb-4
                     border-b border-transparent hover:border-gray-200 focus:border-gray-300
                     focus:outline-none bg-transparent"
          placeholder="Enter Sheet Title"
        />
      );
    }
    
    // For preview/PDF mode
    return (
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        {title}
      </h2>
    );
  };


  // Handle deletion of a chord
  const handleDeleteChord = (index) => {
    if (!isInteractive) return;
    const newChords = chords.filter((_, idx) => idx !== index);
    setChords(newChords);
  };

  // For interactive mode, show all slots. For preview/print, only show filled slots
  const slots = isInteractive
  ? Array(gridConfig.rows * gridConfig.cols).fill(null).map((_, index) => chords[index] || null)
  : chords;


  const getMobileStyles = () => {
    if (isPreview) return {}; // No mobile styles in preview mode
    
    return {
      padding: '0.5rem',  // Smaller padding on mobile
      transform: window.innerWidth < 640 ? 'scale(0.9)' : 'none',
      transformOrigin: 'top left'
    };
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
        backgroundColor: 'white',
        ...getMobileStyles()
      }}
    >
      {slots.map((chord, index) => {
        if (!chord && (isPreview)) return null;

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
                
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                                transition-opacity flex gap-1 p-1 z-10">
                    <button
                      onClick={() => onEditChord(chord, index)}
                      className="p-1.5 bg-blue-500 text-white rounded-md
                               hover:bg-blue-600 focus:outline-none"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteChord(index)}
                      className="p-1.5 bg-red-500 text-white rounded-md
                               hover:bg-red-600 focus:outline-none"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {!chord && isInteractive && (
              <span className="text-gray-400 text-sm">Empty</span>
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
        backgroundColor: 'white',
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
