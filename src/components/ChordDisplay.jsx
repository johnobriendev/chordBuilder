import React from 'react';

const ChordDisplay = ({ chord, size = 'medium' }) => {
  // Constants to match GuitarDiagram
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  const sizeConfigs = {
    small: {
      containerClass: 'w-14 h-20',
      wrapperClass: 'w-16',
      dotSize: 'w-1 h-1',
      titleClass: 'text-[10px]',
      fretNumberClass: 'text-[8px]',
      openStringTop: '-8px',
      titleSpacing: 'mb-2',
      fretNumberOffset: '-16px', // Increased left offset for fret numbers
      fretNumberWidth: '14px'    // Wider space for fret numbers
    },
    medium: {
      containerClass: 'w-20 h-28',
      wrapperClass: 'w-24',
      dotSize: 'w-2 h-2',
      titleClass: 'text-sm',
      fretNumberClass: 'text-xs',
      openStringTop: '-12px',
      titleSpacing: 'mb-3',
      fretNumberOffset: '-20px',
      fretNumberWidth: '16px'
    },
    large: {
      containerClass: 'w-24 h-32',
      wrapperClass: 'w-28',
      dotSize: 'w-2.5 h-2.5',
      titleClass: 'text-sm',
      fretNumberClass: 'text-sm',
      openStringTop: '-12px',
      titleSpacing: 'mb-4',
      fretNumberOffset: '-24px',
      fretNumberWidth: '20px'
    }
  };

  

  // Get the appropriate size configuration
  const sizeConfig = sizeConfigs[size];


  // Function to check if a note exists at a given position
  const hasNote = (string, fret) => {
    return chord.notes.includes(`${string}-${fret}`);
  };

  const hasOpenString = (string) => chord.openStrings?.includes(`open-${string}`);



  return (
    <div className={`flex flex-col items-center ${sizeConfig.wrapperClass}`}>
      <h3 className={`font-medium ${sizeConfig.titleClass} ${sizeConfig.titleSpacing} truncate w-full text-center`}>
        {chord.title || 'Untitled Chord'}
      </h3>

      <div className="relative">
        {/* Open String Indicators */}
        <div className="absolute w-full" style={{ top: sizeConfig.openStringTop }}>
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <div
              key={`open-${stringIndex}`}
              className="absolute w-full flex justify-center"
              style={{ 
                left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {hasOpenString(stringIndex) && (
                <div className={`${sizeConfig.dotSize} border border-blue-500 rounded-full`} />
              )}
            </div>
          ))}
        </div>

        {/* Fret Numbers with improved positioning */}
        <div 
          className="absolute top-0 bottom-0"
          style={{ 
            left: sizeConfig.fretNumberOffset,
            width: sizeConfig.fretNumberWidth
          }}
        >
          {chord.fretNumbers.map((number, index) => (
            number && (
              <div
                key={`fret-number-${index}`}
                className={`absolute ${sizeConfig.fretNumberClass} text-right w-full`}
                style={{
                  top: `${((index * 100) / NUM_FRETS) + (100 / (NUM_FRETS * 2))}%`,
                  transform: 'translateY(-50%)'
                }}
              >
                {number}
              </div>
            )
          ))}
        </div>

        <div className={`${sizeConfig.containerClass} border border-gray-300 rounded p-1`}>
          {/* Fret Lines and Strings */}
          <div className="absolute inset-0">
            {[...Array(NUM_FRETS + 1)].map((_, index) => (
              <div
                key={`fret-${index}`}
                className="absolute w-full h-px bg-gray-300"
                style={{ top: `${(index * 100) / NUM_FRETS}%` }}
              />
            ))}
            {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
              <div
                key={`string-${stringIndex}`}
                className="absolute top-0 bottom-0 w-px bg-gray-300"
                style={{ left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%` }}
              />
            ))}
          </div>

          {/* Note Dots */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <React.Fragment key={`string-notes-${stringIndex}`}>
              {[...Array(NUM_FRETS)].map((_, fretIndex) => (
                hasNote(stringIndex, fretIndex) && (
                  <div
                    key={`note-${stringIndex}-${fretIndex}`}
                    className={`absolute ${sizeConfig.dotSize} rounded-full bg-blue-500`}
                    style={{
                      left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%`,
                      top: `${((fretIndex * 100) / NUM_FRETS) + (100 / (NUM_FRETS * 2))}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>    
  );
};

export default ChordDisplay;


