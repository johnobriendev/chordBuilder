import React from 'react';

const ChordDisplay = ({ chord, size = 'medium', isPreview = false }) => {
  // Constants that can now be dynamic based on chord data
  const NUM_STRINGS = chord.numStrings || 6;
  const NUM_FRETS = chord.numFrets || 6; // Now reads from chord data instead of being hardcoded

  // Size configurations for different fret counts
  // We need different configurations for 6-fret vs 12-fret diagrams
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

    // Calculate container dimensions based on fret count
    // 6 frets gets base dimensions, 12 frets gets proportionally larger
    const fretRatio = fretCount / 6;

    if (fretCount === 6) {
      // Original 6-fret dimensions
      return {
        small: { ...baseConfig.small, containerClass: 'w-14 h-20', wrapperClass: 'w-16' },
        medium: { ...baseConfig.medium, containerClass: 'w-20 h-28', wrapperClass: 'w-24' },
        large: { ...baseConfig.large, containerClass: 'w-24 h-32', wrapperClass: 'w-28' }
      };
    } else {
      // 12-fret dimensions (or other counts) - scale proportionally
      return {
        small: {
          ...baseConfig.small,
          containerClass: `w-14 h-${Math.round(20 * fretRatio)}`,
          wrapperClass: 'w-16'
        },
        medium: {
          ...baseConfig.medium,
          containerClass: `w-20 h-${Math.round(28 * fretRatio)}`,
          wrapperClass: 'w-24'
        },
        large: {
          ...baseConfig.large,
          containerClass: `w-24 h-${Math.round(32 * fretRatio)}`,
          wrapperClass: 'w-28'
        }
      };
    }
  };

  const getMobileSizeConfigs = (fretCount) => {
    const desktopConfigs = getSizeConfigs(fretCount);
    const fretRatio = fretCount / 6;

    if (fretCount === 6) {
      // Original mobile 6-fret dimensions
      return {
        small: { ...desktopConfigs.small, containerClass: 'w-12 h-16', wrapperClass: 'w-14', titleClass: 'text-[10px]' },
        medium: { ...desktopConfigs.medium, containerClass: 'w-16 h-24', wrapperClass: 'w-20', titleClass: 'text-xs' },
        large: { ...desktopConfigs.large, containerClass: 'w-20 h-28', wrapperClass: 'w-24', titleClass: 'text-sm' }
      };
    } else {
      // 12-fret mobile dimensions - scale proportionally
      return {
        small: {
          ...desktopConfigs.small,
          containerClass: `w-12 h-${Math.round(16 * fretRatio)}`,
          wrapperClass: 'w-14',
          titleClass: 'text-[10px]'
        },
        medium: {
          ...desktopConfigs.medium,
          containerClass: `w-16 h-${Math.round(24 * fretRatio)}`,
          wrapperClass: 'w-20',
          titleClass: 'text-xs'
        },
        large: {
          ...desktopConfigs.large,
          containerClass: `w-20 h-${Math.round(28 * fretRatio)}`,
          wrapperClass: 'w-24',
          titleClass: 'text-sm'
        }
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

        {/* Fret Numbers - now uses the dynamic NUM_FRETS */}
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

        <div className={`${sizeConfig.containerClass} border ${isPreview ? 'border-gray-300' : 'border-black'} rounded p-1`}>
          {/* Fret Lines and Strings - now uses dynamic NUM_FRETS */}
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

          {/* Note Dots - now uses dynamic NUM_FRETS for positioning */}
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

