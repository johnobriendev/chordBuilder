// src/components/ChordSheet.jsx
import React from 'react';
import ChordDisplay from './ChordDisplay';

const ChordSheet = ({ chords = [] }) => {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-4 gap-4">
        {chords.map(chord => (
          <div key={chord.id} className="border rounded p-4 bg-white">
            <ChordDisplay chord={chord} size="medium" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordSheet;