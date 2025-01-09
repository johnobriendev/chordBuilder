// src/components/ChordSheet.jsx
import {useState} from 'react';
import ChordDisplay from './ChordDisplay';



const ChordSheet = ({ chords = [], gridConfig, isPreview = false }) => {

 

  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
  };


  

  
  
  return (
    <div 
      className={`mx-auto bg-white ${isPreview ? '' : 'shadow-lg rounded-lg'}`}
      style={{
        ...(isPreview 
          ? {
              width: '8.5in',
              height: '11in',
              padding: '1in'
            }
          : {
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '8.5/11',
              padding: '10%'
            }
        )
      }}
    >
      <div 
        className="grid h-full w-full gap-8"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
        }}
      >
        {chords.map(chord => (
          <div 
            key={chord.id} 
            className="flex justify-center items-center p-2"
          >
            <ChordDisplay 
              chord={chord} 
              size={getDisplaySize()} 
            />
          </div>
        ))}

        {[...Array(gridConfig.rows * gridConfig.cols - chords.length)].map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="border border-dashed border-gray-200 rounded m-2"
          />
        ))}
      </div>
    </div>
    
  );
   

};

export default ChordSheet;




