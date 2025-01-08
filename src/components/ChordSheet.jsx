// src/components/ChordSheet.jsx
import {useState} from 'react';
import ChordDisplay from './ChordDisplay';
import { Grid } from 'lucide-react';

const ChordSheet = ({ chords = [], gridConfig }) => {
 

  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
  };

  
  
  return (
    <div className="mx-auto bg-white">
      <div 
        className="relative w-full"
        style={{ 
          maxWidth: '800px',
          aspectRatio: '8.5 / 11',
          padding: 'calc(0.5in / 8.5 * 600px)'
        }}
      >
        <div 
          className="grid h-full w-full gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
          }}
        >
          {chords.map(chord => (
            <div 
              key={chord.id} 
              className="flex justify-center items-center border border-gray-200 rounded p-1"
            >
              <ChordDisplay 
                chord={chord} 
                size={getDisplaySize()} 
              />
            </div>
          ))}

          {/* Placeholder slots */}
          {[...Array(gridConfig.rows * gridConfig.cols - chords.length)].map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="border border-dashed border-gray-200 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChordSheet;