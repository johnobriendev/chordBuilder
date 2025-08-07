import React from 'react';

const ChordDisplay = ({ chord, size = 'medium', isPreview = false }) => {
  const NUM_STRINGS = chord.numStrings || 6;
  const NUM_FRETS = chord.numFrets || 6;

  // Create separate size configurations for 6-fret and 12-fret diagrams
  // This avoids the Tailwind dynamic class generation problem
  const getSizeConfigs = (fretCount) => {
    const baseConfig = {
      small: {
        dotSize: 'w-1 h-1',
        titleClass: 'text-xs',
        fretNumberClass: 'text-[8px]',
        openStringTop: '-8px',
        titleSpacing: 'h-8',
        containerSpacing: 'mt-2',
        fretNumberOffset: '-18px',
        fretNumberWidth: '14px'
      },
      medium: {
        dotSize: 'w-2 h-2',
        titleClass: 'text-sm',
        fretNumberClass: 'text-xs',
        openStringTop: '-12px',
        titleSpacing: 'h-8',
        containerSpacing: 'mt-3',
        fretNumberOffset: '-24px',
        fretNumberWidth: '16px'
      },
      large: {
        dotSize: 'w-2.5 h-2.5',
        titleClass: 'text-base',
        fretNumberClass: 'text-sm',
        openStringTop: '-12px',
        titleSpacing: 'h-10',
        containerSpacing: 'mt-4',
        fretNumberOffset: '-30px',
        fretNumberWidth: '20px'
      }
    };

    // Use explicit Tailwind classes that we know exist
    if (fretCount === 6) {
      return {
        small: { ...baseConfig.small, containerClass: 'w-14 h-20', wrapperClass: 'w-16' },
        medium: { ...baseConfig.medium, containerClass: 'w-20 h-28', wrapperClass: 'w-24' },
        large: { ...baseConfig.large, containerClass: 'w-24 h-32', wrapperClass: 'w-28' }
      };
    } else {
      // For 12-fret diagrams, use explicit height classes that exist in Tailwind
      return {
        small: { ...baseConfig.small, containerClass: 'w-14 h-40', wrapperClass: 'w-16' },
        medium: { ...baseConfig.medium, containerClass: 'w-20 h-56', wrapperClass: 'w-24' },
        large: { ...baseConfig.large, containerClass: 'w-24 h-64', wrapperClass: 'w-28' }
      };
    }
  };

  const getMobileSizeConfigs = (fretCount) => {
    const desktopConfigs = getSizeConfigs(fretCount);
    
    if (fretCount === 6) {
      return {
        small: { ...desktopConfigs.small, containerClass: 'w-12 h-16', wrapperClass: 'w-14', titleClass: 'text-[10px]' },
        medium: { ...desktopConfigs.medium, containerClass: 'w-16 h-24', wrapperClass: 'w-20', titleClass: 'text-xs' },
        large: { ...desktopConfigs.large, containerClass: 'w-20 h-28', wrapperClass: 'w-24', titleClass: 'text-sm' }
      };
    } else {
      // Mobile 12-fret with explicit Tailwind classes
      return {
        small: { ...desktopConfigs.small, containerClass: 'w-12 h-32', wrapperClass: 'w-14', titleClass: 'text-[10px]' },
        medium: { ...desktopConfigs.medium, containerClass: 'w-16 h-48', wrapperClass: 'w-20', titleClass: 'text-xs' },
        large: { ...desktopConfigs.large, containerClass: 'w-20 h-56', wrapperClass: 'w-24', titleClass: 'text-sm' }
      };
    }
  };

  // Get the appropriate size configuration based on fret count
  const sizeConfigs = isPreview ? getSizeConfigs(NUM_FRETS) : getMobileSizeConfigs(NUM_FRETS);
  const sizeConfig = sizeConfigs[size];

  // Function to check if a note exists at a given position
  const hasNote = (string, fret) => {
    return chord.notes.includes(`${string}-${fret}`);
  };

  const hasOpenString = (string) => chord.openStrings?.includes(`open-${string}`);

  //Function to check if a position is the root note
  const isRootNote = (string, fret, isOpen = false) => {
    const noteId = isOpen ? `open-${string}` : `${string}-${fret}`;
    return chord.rootNotes?.includes(noteId) || false;
  };

  //Function to get the appropriate color class for notes
  const getNoteColor = (string, fret, isOpen = false) => {
    if (isRootNote(string, fret, isOpen)) {
      return 'bg-blue-500'; // Darker blue for root notes
    }
    return 'bg-black'; // Regular blue for normal notes
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title container with fixed height */}
      <div className={`w-full ${sizeConfig.titleSpacing} flex items-center justify-center`}>
        <h3 className={`font-medium ${sizeConfig.titleClass} text-center px-1 leading-tight`}>
          {chord.title}
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
                <>
                  {/* Root open strings show as filled dots, regular as hollow circles */}
                  {isRootNote(stringIndex, null, true) ? (
                    <div className={`${sizeConfig.dotSize} ${getNoteColor(stringIndex, null, true)} rounded-full`} />
                  ) : (
                    <div className={`${sizeConfig.dotSize} border border-black rounded-full`} />
                  )}
                </>
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
                data-fret-number="true"
              >
                {number}
              </div>
            )
          ))}
        </div>

        <div className={`${sizeConfig.containerClass} border ${isPreview ? 'border-gray-300' : 'border-black'} rounded p-1`}>
          {/* Fret Lines and Strings */}
          <div className="absolute inset-0">
            {[...Array(NUM_FRETS + 1)].map((_, index) => (
              <div
                key={`fret-${index}`}
                className={`absolute w-full h-px ${isPreview ? 'bg-gray-300' : 'bg-black'}`}
                style={{ top: `${(index * 100) / NUM_FRETS}%` }}
              />
            ))}
            {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
              <div
                key={`string-${stringIndex}`}
                className={`absolute top-0 bottom-0 w-px ${isPreview ? 'bg-gray-300' : 'bg-black'}`}
                style={{ left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%` }}
              />
            ))}
          </div>

          {/* Note Dots - UPDATED with root note coloring */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <React.Fragment key={`string-notes-${stringIndex}`}>
              {[...Array(NUM_FRETS)].map((_, fretIndex) => (
                // Show note if it's in the notes array OR if it's the root note
                (hasNote(stringIndex, fretIndex) || isRootNote(stringIndex, fretIndex)) && (
                  <div
                    key={`note-${stringIndex}-${fretIndex}`}
                    className={`absolute ${sizeConfig.dotSize} rounded-full ${getNoteColor(stringIndex, fretIndex)}`}
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

