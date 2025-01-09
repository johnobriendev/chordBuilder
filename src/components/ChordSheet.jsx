// src/components/ChordSheet.jsx
import {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ChordDisplay from './ChordDisplay';



const ChordSheet = ({ chords = [], gridConfig, isPreview = false, isDraggable = true, classname = ''  }) => {

 

  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !setChords) return;

    const items = Array.from(chords);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChords(items);
  };


   // Calculate total slots needed
   const totalSlots = gridConfig.rows * gridConfig.cols;
  
   // Create array of all slots (filled with chords or empty)
   const slots = Array(totalSlots).fill(null).map((_, index) => {
     return chords[index] || null;
   });
 
   // Generate grid template based on configuration
   const gridTemplateStyle = {
     gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
     gap: '1rem',
     width: '100%'
   };

   const renderContent = () => {
    if (isDraggable) {
      return (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="chord-grid">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid"
                style={gridTemplateStyle}
              >
                {slots.map((chord, index) => (
                  <div key={chord ? chord.id : `empty-${index}`} className="aspect-square">
                    {chord ? (
                      <Draggable
                        draggableId={chord.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="h-full flex items-center justify-center"
                          >
                            <ChordDisplay
                              chord={chord}
                              size={getDisplaySize()}
                            />
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      !isPreview && (
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Empty</span>
                        </div>
                      )
                    )}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }

    return (
      <div className="grid" style={gridTemplateStyle}>
        {slots.map((chord, index) => (
          <div key={chord ? chord.id : `empty-${index}`} className="aspect-square flex items-center justify-center">
            {chord && (
              <ChordDisplay
                chord={chord}
                size={getDisplaySize()}
              />
            )}
          </div>
        ))}
      </div>
    );
  };


   


    return (
      <div 
        className={`bg-white ${isPreview ? '' : 'shadow-lg rounded-lg'}`}
        style={{
          ...(isPreview 
            ? {
                width: '8.5in',
                height: '11in',
                padding: '0.75in',
                margin: '0 auto'
              }
            : {
                width: '100%',
                padding: '1.5rem'
              }
          )
        }}
      >
        {renderContent()}
      </div>
    );
 
  
};

export default ChordSheet;



