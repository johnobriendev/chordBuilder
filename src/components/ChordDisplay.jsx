import React from 'react';

const ChordDisplay = ({ chord, size = 'medium', isPreview = false }) => {
  // Constants to match GuitarDiagram
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  const sizeConfigs = {
    small: {
      containerClass: 'w-14 h-20',
      wrapperClass: 'w-16',
      dotSize: 'w-1 h-1',
      titleClass: 'text-xs',
      fretNumberClass: 'text-[8px]',
      openStringTop: '-8px',
      titleSpacing: 'h-8', // Fixed height for title area
      containerSpacing: 'mt-2', // Space between title and diagram
      fretNumberOffset: '-18px',
      fretNumberWidth: '14px'
    },
    medium: {
      containerClass: 'w-20 h-28',
      wrapperClass: 'w-24',
      dotSize: 'w-2 h-2',
      titleClass: 'text-sm',
      fretNumberClass: 'text-xs',
      openStringTop: '-12px',
      titleSpacing: 'h-8', // Fixed height for title area
      containerSpacing: 'mt-3', // Space between title and diagram
      fretNumberOffset: '-24px',
      fretNumberWidth: '16px'
    },
    large: {
      containerClass: 'w-24 h-32',
      wrapperClass: 'w-28',
      dotSize: 'w-2.5 h-2.5',
      titleClass: 'text-base',
      fretNumberClass: 'text-sm',
      openStringTop: '-12px',
      titleSpacing: 'h-10', // Fixed height for title area
      containerSpacing: 'mt-4', // Space between title and diagram
      fretNumberOffset: '-30px',
      fretNumberWidth: '20px'
    }
  };

  const mobileSizeConfigs = {
    small: {
      ...sizeConfigs.small,
      containerClass: 'w-12 h-16', // Smaller on mobile
      wrapperClass: 'w-14',
      titleClass: 'text-[10px]'
    },
    medium: {
      ...sizeConfigs.medium,
      containerClass: 'w-16 h-24', // Smaller on mobile
      wrapperClass: 'w-20',
      titleClass: 'text-xs'
    },
    large: {
      ...sizeConfigs.large,
      containerClass: 'w-20 h-28', // Smaller on mobile
      wrapperClass: 'w-24',
      titleClass: 'text-sm'
    }
  };


  

  // Get the appropriate size configuration
  const sizeConfig = isPreview ? sizeConfigs[size] : mobileSizeConfigs[size];


  // Function to check if a note exists at a given position
  const hasNote = (string, fret) => {
    return chord.notes.includes(`${string}-${fret}`);
  };

  const hasOpenString = (string) => chord.openStrings?.includes(`open-${string}`);



  return (
    <div className="flex flex-col items-center w-full">
      {/* Title container with fixed height */}
      <div className={`w-full ${sizeConfig.titleSpacing} flex items-center justify-center`}>
        <h3 className={`font-medium ${sizeConfig.titleClass} text-center px-1 leading-tight`}>
          {chord.title || 'Untitled Chord'}
        </h3>
      </div>

      {/* Diagram container */}
      <div className={`relative ${sizeConfig.containerSpacing}`}>
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

        {/* Fret Numbers */}
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

