// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// export const generatePDF = async (modalContent, filename = 'chord-sheet.pdf') => {
//   try {
//     const sheetContent = modalContent.querySelector('[id^="chord-sheet"]');
//     if (!sheetContent) {
//       throw new Error('Chord sheet content not found');
//     }

//     // Create canvas
//     const canvas = await html2canvas(sheetContent, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: '#ffffff'
//     });

//     // Get dimensions in inches (assuming 96 DPI)
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
    
//     // Create PDF (letter size: 8.5 x 11 inches)
//     const pdf = new jsPDF({
//       orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
//       unit: 'px',
//       format: 'letter'
//     });

//     // Calculate scaling to fit the page
//     const pdfWidth = pdf.internal.pageSize.getWidth() * 96 / 72; // Convert from PDF points to pixels
//     const pdfHeight = pdf.internal.pageSize.getHeight() * 96 / 72;
    
//     const scale = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
//     const x = (pdfWidth - canvasWidth * scale) / 2 / scale;
//     const y = (pdfHeight - canvasHeight * scale) / 2 / scale;

//     pdf.addImage(
//       canvas.toDataURL('image/jpeg', 1.0),
//       'JPEG',
//       x,
//       y,
//       canvasWidth,
//       canvasHeight,
//       undefined,
//       'FAST'
//     );

//     pdf.save(filename);
//     return true;
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     return false;
//   }
// };


import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (modalContent, filename = 'chord-sheet.pdf') => {
  try {
    // Get the chord sheet content
    const sheetContent = modalContent.querySelector('[id^="chord-sheet"]');
    if (!sheetContent) {
      throw new Error('Chord sheet content not found');
    }

    // Create canvas with precise dimensions
    const canvas = await html2canvas(sheetContent, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      // Use exact dimensions of US Letter size
      width: 8.5 * 96,  // 8.5 inches at 96 DPI
      height: 11 * 96,  // 11 inches at 96 DPI
      // Prevent any margins or padding from canvas
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 8.5 * 96,
      windowHeight: 11 * 96
    });

    // Create PDF with exact US Letter dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter',
      //compress: true
    });

    // Add the image to the PDF without any additional margins
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0, // x = 0
      0, // y = 0
      8.5, // width = 8.5 inches
      11,  // height = 11 inches
      //undefined,
      //'FAST'
    );

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};




