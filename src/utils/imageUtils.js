import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import React from 'react';
import ChordDisplay from '../components/ChordDisplay';

const EXPORT_CONTAINER_STYLE =
  'position: absolute; left: -9999px; top: 0; background-color: #ffffff; padding: 0.5rem 1rem 1rem 2.25rem;';

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

export const generateAllChordImages = async (chords, format = 'png', onProgress) => {
  if (!chords || chords.length === 0) return false;

  let allSucceeded = true;

  for (let i = 0; i < chords.length; i++) {
    if (onProgress) onProgress(i + 1, chords.length);

    const chord = chords[i];
    const container = document.createElement('div');
    container.style.cssText = EXPORT_CONTAINER_STYLE;
    document.body.appendChild(container);

    const root = createRoot(container);

    try {
      flushSync(() => {
        root.render(
          React.createElement(ChordDisplay, { chord, size: 'large', isPreview: true })
        );
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const success = await generateChordImage(container, chord.title || `chord-${i + 1}`, format);
      if (!success) allSucceeded = false;

      if (i < chords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Error exporting chord "${chord.title}":`, error);
      allSucceeded = false;
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  }

  return allSucceeded;
};
