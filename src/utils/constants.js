export const APP_NAMES = {
  about: 'About Me',
  skills: 'Skills',
  projects: 'Projects',
  contact: 'Contact',
  terminal: 'Terminal',
  snake: 'Snake',
  notepad: 'Notepad',
  files: 'Files',
  settings: 'Settings',
};

export const ICON_MARGIN = 36;
export const ICON_COL_GAP = 20;
export const ICON_ROW_GAP = 22;
export const ICON_WIDTH = 78;
export const ICON_HEIGHT = 76;
export const CELL_W = ICON_WIDTH + ICON_COL_GAP;
export const CELL_H = ICON_HEIGHT + ICON_ROW_GAP;
export const ICON_STORAGE_KEY = 'sudoos-icon-positions';
export const NOTE_STORAGE_KEY = 'sudoos_note_v1';

export function snapToGrid(left, top, bounds) {
  const maxCol = Math.max(0, Math.floor((bounds.w - ICON_MARGIN - ICON_WIDTH) / CELL_W));
  const maxRow = Math.max(0, Math.floor((bounds.h - ICON_MARGIN - ICON_HEIGHT) / CELL_H));
  const col = Math.max(0, Math.min(maxCol, Math.round((left - ICON_MARGIN) / CELL_W)));
  const row = Math.max(0, Math.min(maxRow, Math.round((top - ICON_MARGIN) / CELL_H)));
  return {
    left: ICON_MARGIN + col * CELL_W,
    top: ICON_MARGIN + row * CELL_H,
  };
}

export function loadIconPositions() {
  try {
    const raw = localStorage.getItem(ICON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

export function saveIconPositions(positions) {
  try { localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(positions)); } catch (_) { }
}

export const FILESYSTEM = {
  '~': [
    { n: 'Documents', t: 'dir', i: '<i class="fa-solid fa-folder" style="color:#e94560;"></i>', s: '4 items' },
    { n: 'Projects', t: 'dir', i: '<i class="fa-solid fa-folder-open" style="color:#00bcd4;"></i>', s: '4 items' },
    { n: 'Downloads', t: 'dir', i: '<i class="fa-solid fa-download" style="color:#00e676;"></i>', s: '12 items' },
    { n: 'Pictures', t: 'dir', i: '<i class="fa-regular fa-image" style="color:#ff9100;"></i>', s: '28 items' },
    { n: 'Music', t: 'dir', i: '<i class="fa-solid fa-music" style="color:#7c4dff;"></i>', s: '87 items' },
    { n: 'about_me.txt', t: 'file', i: '<i class="fa-solid fa-file-lines" style="color:#ffffff;"></i>', s: '2 KB' },
    { n: 'skills.json', t: 'file', i: '<i class="fa-solid fa-code" style="color:#ffcc00;"></i>', s: '4 KB' },
    { n: 'resume.pdf', t: 'file', i: '<i class="fa-solid fa-file-pdf" style="color:#ff5f57;"></i>', s: '320 KB' },
    { n: 'portfolio.html', t: 'file', i: '<i class="fa-brands fa-html5" style="color:#e34f26;"></i>', s: '86 KB' },
    { n: '.bashrc', t: 'file', i: '<i class="fa-solid fa-gear" style="color:#aaaaaa;"></i>', s: '1 KB' },
  ],
  '~/Documents': [
    { n: 'notes.txt', t: 'file', i: '<i class="fa-solid fa-file-lines"></i>', s: '1 KB' },
    { n: 'design_brief.docx', t: 'file', i: '<i class="fa-solid fa-file-word" style="color:#2b579a;"></i>', s: '18 KB' },
    { n: 'contracts', t: 'dir', i: '<i class="fa-solid fa-folder"></i>', s: '3 items' },
    { n: 'README.md', t: 'file', i: '<i class="fa-brands fa-markdown"></i>', s: '5 KB' },
    { n: 'invoice_2026.pdf', t: 'file', i: '<i class="fa-solid fa-file-pdf" style="color:#ff5f57;"></i>', s: '210 KB' },
  ],
  '~/Projects': [
    { n: 'novadash', t: 'dir', i: '<i class="fa-solid fa-folder-open"></i>', s: '14 items' },
    { n: 'synthex-ai', t: 'dir', i: '<i class="fa-solid fa-folder-open"></i>', s: '22 items' },
    { n: 'chroma-ds', t: 'dir', i: '<i class="fa-solid fa-folder-open"></i>', s: '56 items' },
    { n: 'wayfarer', t: 'dir', i: '<i class="fa-solid fa-folder-open"></i>', s: '18 items' },
  ],
  '~/Downloads': [
    { n: 'figma_export.zip', t: 'file', i: '<i class="fa-solid fa-file-zipper"></i>', s: '14 MB' },
    { n: 'fonts.zip', t: 'file', i: '<i class="fa-solid fa-file-zipper"></i>', s: '2 MB' },
    { n: 'inspo.png', t: 'file', i: '<i class="fa-regular fa-image"></i>', s: '4.2 MB' },
    { n: 'nodejs-installer.pkg', t: 'file', i: '<i class="fa-solid fa-box-open"></i>', s: '72 MB' },
  ],
  '~/Pictures': [
    { n: 'screenshots', t: 'dir', i: '<i class="fa-solid fa-folder"></i>', s: '42 items' },
    { n: 'avatar.png', t: 'file', i: '<i class="fa-regular fa-image"></i>', s: '820 KB' },
    { n: 'wallpapers', t: 'dir', i: '<i class="fa-solid fa-folder"></i>', s: '8 items' },
  ],
};
