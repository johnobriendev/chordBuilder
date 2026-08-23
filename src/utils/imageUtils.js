import html2canvas from 'html2canvas';

const createSafeImageFilename = (title, extension) => {
  let safeTitle = (title || '')
    .replace(/[<>:"|?*\/\\]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-_.]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (safeTitle.length === 0) safeTitle = 'chord';
  if (safeTitle.length > 50) safeTitle = safeTitle.substring(0, 50);

  return `${safeTitle}.${extension}`;
};

export const generateChordImage = async (element, title, format = 'png') => {
  // html2canvas computes note-container size from its in-flow children (the dot).
  // This makes its translate(-50%,-50%) resolve to different pixel shifts depending
  // on whether a dot coexists with the x-mark. Forcing containers to zero-size
  // normalises the baseline so all absolute children position from the intersection point.
  const styleEl = document.createElement('style');
  styleEl.id = 'image-export-x-fix';
  styleEl.innerHTML = `
    .note-container { width: 0 !important; height: 0 !important; }
    .fretted-x-mark { transform: translate(-25%, -50%) !important; }
    .pdf-x-mark-large:not(.fretted-x-mark) { transform: translate(-25%, calc(-55% - 0px)) !important; }
  `;
  document.head.appendChild(styleEl);

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mime, format === 'jpeg' ? 0.95 : undefined);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = createSafeImageFilename(title, format === 'jpeg' ? 'jpg' : 'png');
    link.click();

    return true;
  } catch (error) {
    console.error('Error generating image:', error);
    return false;
  } finally {
    document.head.removeChild(styleEl);
  }
};
