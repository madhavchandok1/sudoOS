import { useState, useCallback, useRef } from 'react';

let audioCache = {};
let isMuted = false;

function playOSSound(name) {
  if (isMuted) return;
  const sources = {
    open: '/assets/sounds/openwindow.mp3',
    close: '/assets/sounds/mouseclick.mp3',
    context: '/assets/sounds/mouseclick.mp3',
    click: '/assets/sounds/mouseclick.mp3',
    boot: '/assets/sounds/osboot.mp3',
  };
  const src = sources[name];
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.35;
    audio.play().catch(() => {});
  } catch (_) {}
}

function setMuted(val) {
  isMuted = val;
}

function getMuted() {
  return isMuted;
}

export { playOSSound, setMuted, getMuted };

export function useSound() {
  return { playOSSound };
}
