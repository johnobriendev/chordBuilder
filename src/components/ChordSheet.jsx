// src/components/ChordSheet.jsx
import React, { forwardRef } from 'react'
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2 } from 'lucide-react';

// Constants for A4 paper size and layout
const A4 = {
  width: '210mm',
  height: '297mm',
  margin: '20mm',
  topPadding: '10mm' // Reduced top padding to start content higher
};

const ChordSheet = forwardRef(({ 
  id = 'chord-sheet',
  chords = [], 
  gridConfig, 
  isPreview = false,
  isPrinting = false, 
  isInteractive = false,
  setChords,
  onEditChord
}, ref) => {
  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
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


  // Calculate grid gap based on the number of columns
  const getGridGap = () => {
    if (gridConfig.cols <= 4) return 'gap-8';
    if (gridConfig.cols <= 6) return 'gap-6';
    return 'gap-4';
  };

  const renderContent = () => (
    <div
      className={`grid ${getGridGap()} w-full`}
      style={{
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
        padding: isPreview ? A4.margin : '1rem',
        paddingTop: isPreview ? A4.topPadding : '1rem', // Use smaller top padding
      }}
    >
      {slots.map((chord, index) => {
        if (!chord && (isPreview)) return null;

        return (
          <div 
            key={chord ? chord.id : `empty-${index}`}
            className={`
              flex items-start justify-center
              ${!chord && isInteractive ? 'border-2 border-dashed border-gray-200 rounded-lg min-h-[120px]' : ''}
            `}
          >
            {chord && (
              <div className="relative group w-full">
                <ChordDisplay 
                  chord={chord} 
                  size={getDisplaySize()} 
                />
                
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                                transition-opacity flex gap-1 p-1 z-10">
                    <button
                      onClick={() => onEditChord(chord, index)}
                      className="p-1.5 bg-blue-500 text-white rounded-md
                               hover:bg-blue-600 focus:outline-none"
                      title="Edit chord"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteChord(index)}
                      className="p-1.5 bg-red-500 text-white rounded-md
                               hover:bg-red-600 focus:outline-none"
                      title="Delete chord"
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
      className={`
        bg-white
        ${isInteractive ? 'shadow-lg rounded-lg' : ''}
      `}
      style={{
        width: isPreview ? A4.width : '100%',
        minHeight: isPreview ? A4.height : isInteractive ? '500px' : 'auto',
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        // Add display flex to ensure content starts from the top
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      {renderContent()}
    </div>
  );
});



  

  ChordSheet.displayName = 'ChordSheet';

export default ChordSheet;
