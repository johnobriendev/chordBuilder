import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (modalContent, filename = 'chord-sheet.pdf') => {
  try {
    // Get the chord sheet content
    const sheetContent = modalContent.querySelector('[id^="chord-sheet"]');
    if (!sheetContent) {
      throw new Error('Chord sheet content not found');
    }

    //  CSS FIX: Adjust fret number positioning for PDF capture
    const styleElement = document.createElement('style');
    styleElement.id = 'pdf-positioning-fix';
    styleElement.innerHTML = `
      [data-fret-number="true"] {
        transform: translateY(-50%) !important;
      }
    `;
    document.head.appendChild(styleElement);


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

     // CLEANUP: Remove the temporary CSS fix
    document.head.removeChild(styleElement);

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
    const existingStyle = document.getElementById('pdf-positioning-fix');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    return false;
  }
};




