import React from 'react';

const ChordDisplay = ({ chord, size = 'medium' }) => {
  // Constants to match GuitarDiagram
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  
  const sizeConfigs = {
    small: {
      containerClass: 'w-full aspect-[2/3]', // Maintain aspect ratio
      dotSize: 'w-[8%] h-[8%]',
      titleClass: 'text-xs',
      fretNumberClass: 'text-xs'
    },
    medium: {
      containerClass: 'w-full aspect-[2/3]',
      dotSize: 'w-[10%] h-[10%]',
      titleClass: 'text-sm',
      fretNumberClass: 'text-sm'
    },
    large: {
      containerClass: 'w-full aspect-[2/3]',
      dotSize: 'w-[12%] h-[12%]',
      titleClass: 'text-base',
      fretNumberClass: 'text-base'
    }
  };

  // Get the appropriate size configuration
  const sizeConfig = sizeConfigs[size];

  // Function to check if a note exists at a given position
  const hasNote = (string, fret) => {
    return chord.notes.includes(`${string}-${fret}`);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Chord Title */}
      <h3 className={`font-medium mb-2 ${sizeConfig.titleClass}`}>
        {chord.title || 'Untitled Chord'}
      </h3>

      {/* Chord Diagram */}
      <div className="relative border border-gray-300 rounded p-2">
        <div className={`relative ${sizeConfig.containerClass}`}>
          {/* Fret Numbers */}
          <div className="absolute -left-6 top-0 bottom-0 w-4">
            {chord.fretNumbers.map((number, index) => (
              number && (
                <div
                  key={`fret-number-${index}`}
                  className={`absolute ${sizeConfig.fretNumberClass} font-medium`}
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

          {/* Fret Lines (horizontal) */}
          {[...Array(NUM_FRETS + 1)].map((_, index) => (
            <div
              key={`fret-${index}`}
              className="absolute w-full h-px bg-gray-400"
              style={{ 
                top: `${(index * 100) / NUM_FRETS}%`
              }}
            />
          ))}
          
          {/* Strings (vertical) */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="absolute top-0 bottom-0 w-px bg-gray-400"
              style={{ 
                left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%`
              }}
            />
          ))}
          
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