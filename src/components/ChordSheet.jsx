// src/components/ChordSheet.jsx
import {useState} from 'react';
import ChordDisplay from './ChordDisplay';
import { Grid } from 'lucide-react';

const ChordSheet = ({ chords = [] }) => {
  // State for grid configuration
  const [gridConfig, setGridConfig] = useState({ rows: 4, cols: 4 });

  // Available grid configurations
  const gridOptions = [
    { 
      label: '4 x 4', 
      rows: 4, 
      cols: 4 
    },
    { 
      label: '6 x 6', 
      rows: 6, 
      cols: 6 
    },
    { 
      label: '8 x 8', 
      rows: 8, 
      cols: 8 
    }
  ];

  const handleGridChange = (event) => {
    const [cols, rows] = event.target.value.split('x').map(num => parseInt(num.trim()));
    setGridConfig({ rows, cols });
  };

  // Calculate display size based on grid configuration
  const getDisplaySize = () => {
    if (gridConfig.cols <= 4) return 'large';
    if (gridConfig.cols <= 6) return 'medium';
    return 'small';
  };

  
  
  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid size={20} className="text-gray-600" />
            <select
              value={`${gridConfig.cols}x${gridConfig.rows}`}
              onChange={handleGridChange}
              className="px-3 py-2 border rounded-md text-gray-700 text-sm"
            >
              {gridOptions.map((option) => (
                <option key={option.label} value={`${option.cols}x${option.rows}`}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {/* <Download size={16} /> Export PDF */}
          </button>
        </div>
      </div>

      {/* Page Container - Represents a standard letter page */}
      <div className="mx-auto bg-white">
        <div 
          className="relative w-full"
          style={{ 
            maxWidth: '600px',
            aspectRatio: '8.5 / 11',
            padding: 'calc(0.5in / 8.5 * 600px)'
          }}
        >
          {/* Grid Container */}
          <div 
            className="grid h-full w-full gap-y-[2%] gap-x-[2%]"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
            }}
          >
            {chords.map(chord => (
              <div 
                key={chord.id} 
                className="flex justify-center items-center"
              >
                <ChordDisplay 
                  chord={chord} 
                  size={getDisplaySize()} 
                />
              </div>
            ))}

            {/* Placeholder slots */}
            {chords.length < (gridConfig.rows * gridConfig.cols) && 
              [...Array(gridConfig.rows * gridConfig.cols - chords.length)].map((_, index) => (
                <div 
                  key={`empty-${index}`}
                  className="border border-dashed border-gray-200 rounded"
                />
              ))
            }
          </div>
        </div>
      </div>                


    </div>
  );
};

export default ChordSheet;