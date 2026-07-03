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
  }
};
