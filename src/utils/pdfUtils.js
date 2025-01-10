import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// A4 dimensions in millimeters
const A4 = {
  width: 210,
  height: 297,
  margin: 20
};

// Convert millimeters to pixels at 96 DPI
const MM_TO_PX = 96 / 25.4;

export const generatePDF = async (modalContent, filename = 'chord-sheet.pdf') => {
  try {
    // Create a temporary container with precise A4 dimensions
    const container = document.createElement('div');
    
    // Set up container styles for precise A4 sizing
    Object.assign(container.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      // Convert A4 dimensions to pixels for accurate rendering
      width: `${A4.width * MM_TO_PX}px`,
      height: `${A4.height * MM_TO_PX}px`,
      padding: `${A4.margin * MM_TO_PX}px`,
      backgroundColor: 'white',
      overflow: 'hidden',
      // Reset styles that might affect rendering
      margin: '0',
      border: 'none',
      boxSizing: 'border-box'
    });

    // Clone the content but only take the ChordSheet part
    const sheetContent = modalContent.querySelector('[id^="chord-sheet"]')?.cloneNode(true);
    if (!sheetContent) {
      throw new Error('Chord sheet content not found');
    }

    // Reset any modal-specific styling
    sheetContent.style.backgroundColor = 'white';
    sheetContent.style.boxShadow = 'none';
    sheetContent.style.width = '100%';
    sheetContent.style.height = '100%';
    sheetContent.style.padding = '0';
    sheetContent.style.margin = '0';

    // Remove any interactive elements
    sheetContent.querySelectorAll('button').forEach(btn => btn.remove());

    // Add the cleaned content to our container
    container.appendChild(sheetContent);
    document.body.appendChild(container);

    // Wait for any fonts to load and layout to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create canvas with precise dimensions
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      width: container.offsetWidth,
      height: container.offsetHeight,
      // Ensure consistent font rendering
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Calculate the scaling factor to fit the canvas to A4
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    // Add the image to the PDF, maintaining A4 proportions
    pdf.addImage(
      imgData,
      'JPEG',
      0,
      0,
      A4.width,
      A4.height,
      undefined,
      'FAST'
    );

    // Clean up
    document.body.removeChild(container);
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};




