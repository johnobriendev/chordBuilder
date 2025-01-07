import React from 'react';

const GuitarDiagram = () => {
  const NUM_STRINGS = 6;
  const NUM_FRETS = 6;

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="relative border-2 border-gray-300 rounded p-4">
        <div className="relative h-[32rem] w-64 mx-auto">
          {/* Fret lines (horizontal) */}
          {[...Array(NUM_FRETS + 1)].map((_, index) => (
            <div
              key={`fret-${index}`}
              className="absolute w-full h-px bg-gray-400"
              style={{ top: `${(index * 100) / NUM_FRETS}%` }}
            />
          ))}
          
          {/* Strings (vertical) */}
          {[...Array(NUM_STRINGS)].map((_, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="absolute top-0 bottom-0 w-px bg-gray-400"
              style={{ left: `${(stringIndex * 100) / (NUM_STRINGS - 1)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuitarDiagram;