// src/components/ChordSheet.jsx
import {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ChordDisplay from './ChordDisplay';
import { Trash2, Edit2 } from 'lucide-react';

const ChordSheet = ({ chords = [], gridConfig, isPreview = false, setChords, onEditChord }) => {

  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
  };


  // Handle deletion of a chord
  const handleDeleteChord = (index) => {
    const newChords = chords.filter((_, idx) => idx !== index);
    setChords(newChords);
  };

  const handleEditChord = (chord, index) => {
    // Call the parent component's edit handler with the chord and its position
    onEditChord(chord, index);
  };

  // Calculate total slots needed
  const totalSlots = gridConfig.rows * gridConfig.cols;

  // Create array of all slots (filled with chords or empty)
  const slots = Array(totalSlots).fill(null).map((_, index) => chords[index] || null);


  const renderEditableContent = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gap: '1rem',
        position: 'relative'
      }}
    >
      {slots.map((chord, index) => (
        <div 
          key={chord ? chord.id : `empty-${index}`}
          className="min-h-[120px]"
        >
          {chord ? (
            <div className="relative group">
              <ChordDisplay chord={chord} size={getDisplaySize()} />
              
              {/* Action buttons container */}
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 
                            transition-opacity flex gap-1 p-1">
                {/* Edit button */}
                <button
                  onClick={() => handleEditChord(chord, index)}
                  className="p-1.5 bg-blue-500 text-white rounded-md
                           hover:bg-blue-600 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 shadow-sm"
                  title="Edit chord"
                >
                  <Edit2 size={16} />
                </button>
                
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteChord(index)}
                  className="p-1.5 bg-red-500 text-white rounded-md
                           hover:bg-red-600 focus:outline-none 
                           focus:ring-2 focus:ring-red-500 shadow-sm"
                  title="Delete chord"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : !isPreview ? (
            <div className="aspect-square border-2 border-dashed 
                          border-gray-200 rounded-lg flex items-center 
                          justify-center h-full">
              <span className="text-gray-400 text-sm">Empty</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  const renderPreviewContent = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gap: '1rem'
      }}
    >
      {slots.map((chord, index) => (
        <div key={chord ? chord.id : `empty-${index}`}>
          {chord && <ChordDisplay chord={chord} size={getDisplaySize()} />}
        </div>
      ))}
    </div>
  );

  return (
    <div 
      className={`bg-white ${isPreview ? '' : 'shadow-lg rounded-lg'}`}
      style={{
        width: isPreview ? '8.5in' : '100%',
        height: isPreview ? '11in' : 'auto',
        padding: isPreview ? '0.75in' : '1.5rem',
        margin: isPreview ? '0 auto' : undefined
      }}
    >
      {!isPreview ? renderEditableContent() : renderPreviewContent()}
    </div>
  );
};

export default ChordSheet;


