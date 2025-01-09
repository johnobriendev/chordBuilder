import React from 'react';

const ChordDisplay = ({ chord, size = 'medium' }) => {
  // Constants to match GuitarDiagram
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  const sizeConfigs = {
    small: {
      containerClass: 'w-16 h-24',
      wrapperClass: 'w-20',
      dotSize: 'w-1.5 h-1.5',
      titleClass: 'text-xs',
      fretNumberClass: 'text-xs'
    },
    medium: {
      containerClass: 'w-20 h-28',
      wrapperClass: 'w-24',
      dotSize: 'w-2 h-2',
      titleClass: 'text-sm',
      fretNumberClass: 'text-xs'
    },
    large: {
      containerClass: 'w-24 h-32',
      wrapperClass: 'w-28',
      dotSize: 'w-2.5 h-2.5',
      titleClass: 'text-sm',
      fretNumberClass: 'text-sm'
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
      <h3 className={`font-medium mb-4 ${sizeConfig.titleClass} truncate w-full text-center`}>
        {chord.title || 'Untitled Chord'}
      </h3>

      <div className="relative">
        {/* Open String Indicators */}
        <div className="absolute w-full" style={{ top: '-12px' }}>
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
                <div className={`${sizeConfig.dotSize} border-2 border-blue-500 rounded-full`} />
              )}
            </div>
          ))}
        </div>

        <div className={`${sizeConfig.containerClass} border border-gray-300 rounded p-1`}>
          {/* Fret Numbers */}
          <div className="absolute -left-4 top-0 bottom-0 w-3">
            {chord.fretNumbers.map((number, index) => (
              number && (
                <div
                  key={`fret-number-${index}`}
                  className={`absolute ${sizeConfig.fretNumberClass}`}
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

          {/* Fret Lines and Strings */}
          <div className="absolute inset-0">
            {[...Array(NUM_FRETS + 1)].map((_, index) => (
              <div
                key={`fret-${index}`}
                className="absolute w-full h-px bg-gray-400"
                style={{ top: `${(index * 100) / NUM_FRETS}%` }}
              />
            ))}
            {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
              <div
                key={`string-${stringIndex}`}
                className="absolute top-0 bottom-0 w-px bg-gray-400"
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




{/* <div className="flex flex-col items-center w-full">
      
      <h3 className={`font-medium mb-2 ${sizeConfig.titleClass}`}>
        {chord.title || 'Untitled Chord'}
      </h3>

   
      <div className={`relative ${sizeConfig.containerClass} border border-gray-300 rounded p-2`}>
        <div className="absolute -left-6 top-0 bottom-0 w-4 flex flex-col justify-between">
          {chord.fretNumbers.map((number, index) => (
            number && (
              <div
                key={`fret-number-${index}`}
                className={`absolute ${sizeConfig.fretNumberClass}`}
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

       
        {[...Array(NUM_FRETS + 1)].map((_, index) => (
          <div
            key={`fret-${index}`}
            className="absolute w-full h-px bg-gray-400"
            style={{ 
              top: `${(index * 100) / NUM_FRETS}%`
            }}
          />
        ))}
        
        
        {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
          <div
            key={`string-${stringIndex}`}
            className="absolute top-0 bottom-0 w-px bg-gray-400"
            style={{ 
              left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%`
            }}
          />
        ))}
        
       
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
    </div> */}