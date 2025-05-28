# Guitar Chord Sheet Builder

A React-based web application for creating, editing, and exporting chord and scale sheets for 4 and 6 stringed instruments. Users can create custom chord diagrams, arrange them in a grid layout, and export them as PDF documents. Great for guitar, bass, ukelele, and mandolin teachers and students.

## Features

- Create custom chord diagrams with an intuitive interface for placing notes and indicators
- Add fret numbers and open string indicators with simple click interactions
- Edit and delete existing chords through a user-friendly interface
- Arrange chords in customizable grid layouts with multiple size options (4x4, 6x6, 8x8)
- Preview chord sheets in a modal window before finalizing export
- Export chord sheets to high-quality PDF format for printing or sharing
- Responsive design that works seamlessly across desktop and mobile devices

## Technologies Used

- React
- Tailwind CSS
- Vite
- html2canvas
- jsPDF


## Installation

1. Clone the repository: `git clone [repository-url]`
2. Navigate to the project directory: `cd chordBuilder `
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Usage

### Creating a Chord Diagram

Use the left panel's guitar diagram interface to create a chord:

- Click on the fretboard to add/remove note positions
- Click above strings to add/remove open string indicators
- Enter fret numbers on the left side if needed
- Enter a name for the chord in the title field
- Click **"Add to Sheet"** to add the chord to your sheet

### Editing Chords

- Click the Chord Sheet name to edit it to a name of your choosing
- Hover over any chord in the sheet to reveal edit and delete buttons
- Click the edit button (pencil icon) to load the chord back into the editor
- Make your changes and click **"Save Changes"**
- Click the delete button (trash icon) to remove a chord from the sheet

### Grid Layout

Use the grid selector in the top toolbar to choose between different grid sizes:

- **4x4** (16 chords)
- **6x6** (36 chords)
- **8x8** (64 chords)

### Previewing and Exporting

1. Click **"Preview & Export"** to open the preview modal
2. Review how your chord sheet will look
3. Click **"Download PDF"** to save your chord sheet as a PDF file

## Component Structure

### Main Components

- `App.jsx`: Main application component and layout
- `GuitarDiagram.jsx`: Interactive chord creation interface
- `ChordDisplay.jsx`: Renders individual chord diagrams
- `ChordSheet.jsx`: Manages the grid layout of chords
- `ChordSheetControls.jsx`: Contains grid size and export controls
- `Modal.jsx`: Preview modal component

## Key Features

- **Responsive Design**: Adapts to different screen sizes while maintaining functionality
- **Preview Mode**: Shows exactly how the PDF will look before export
- **Interactive Editing**: Hover states and edit controls for easy management
- **PDF Export**: Clean, professional-looking PDF output



### Important Notes

- The current version uses a specific version of Rollup (4.23.0) to ensure compatibility with PDF generation
- PDF generation maintains consistent margins and spacing regardless of screen size
- Mobile view provides scrollable interface while maintaining diagram clarity


## License

MIT

