import { useEffect, useRef, useState } from 'react';
import {
  ICON_MARGIN, ICON_COL_GAP, ICON_ROW_GAP, ICON_WIDTH, ICON_HEIGHT,
  CELL_W, CELL_H, snapToGrid, loadIconPositions, saveIconPositions
} from '../utils/constants';
import { playOSSound } from '../utils/sound';

const DESKTOP_ICONS = [
  { id: 'about', label: 'About Me', iconClass: 'fa-solid fa-user-astronaut', colorClass: 'icon-about' },
  { id: 'skills', label: 'Skills', iconClass: 'fa-solid fa-laptop-code', colorClass: 'icon-skills' },
  { id: 'projects', label: 'Projects', iconClass: 'fa-solid fa-folder-tree', colorClass: 'icon-projects' },
  { id: 'contact', label: 'Contact', iconClass: 'fa-solid fa-paper-plane', colorClass: 'icon-contact' },
  { id: 'terminal', label: 'Terminal', iconClass: 'fa-solid fa-terminal', colorClass: 'icon-terminal' },
  { id: 'snake', label: 'Snake', iconClass: 'fa-solid fa-dragon', colorClass: 'icon-snake' },
  { id: 'notepad', label: 'Notepad', iconClass: 'fa-solid fa-pen-to-square', colorClass: 'icon-notepad' },
  { id: 'files', label: 'Files', iconClass: 'fa-solid fa-folder-open', colorClass: 'icon-files' },
  { id: 'settings', label: 'Settings', iconClass: 'fa-solid fa-sliders', colorClass: 'icon-settings' },
];

export default function Desktop({ onContextMenu, openWindow, triggerNotif }) {
  const desktopRef = useRef(null);
  const [iconPositions, setIconPositions] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(null);
  const draggingRef = useRef(null);
  const didDragRef = useRef(false);
  const dragStartRef = useRef({});

  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    const bounds = { w: desktop.offsetWidth, h: desktop.offsetHeight };
    const saved = loadIconPositions();
    const cols = Math.max(1, Math.floor((bounds.w - ICON_MARGIN * 2 + ICON_COL_GAP) / (ICON_WIDTH + ICON_COL_GAP)));
    const positions = saved ? { ...saved } : {};
    DESKTOP_ICONS.forEach((icon, i) => {
      if (!positions[icon.id]) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions[icon.id] = {
          left: ICON_MARGIN + col * (ICON_WIDTH + ICON_COL_GAP),
          top: ICON_MARGIN + row * (ICON_HEIGHT + ICON_ROW_GAP),
        };
      }
      const p = positions[icon.id];
      const snapped = snapToGrid(p.left, p.top, bounds);
      positions[icon.id] = snapped;
    });
    saveIconPositions(positions);
    setIconPositions(positions);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return;
      const { id, startX, startY, startLeft, startTop } = draggingRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
      const desktop = desktopRef.current;
      const bounds = { w: desktop.offsetWidth, h: desktop.offsetHeight };
      const left = Math.max(0, Math.min(startLeft + dx, bounds.w - ICON_WIDTH));
      const top = Math.max(0, Math.min(startTop + dy, bounds.h - ICON_HEIGHT));
      setIconPositions(prev => ({ ...prev, [id]: { left, top } }));
    };
    const onMouseUp = () => {
      if (!draggingRef.current) return;
      const { id } = draggingRef.current;
      const desktop = desktopRef.current;
      const bounds = { w: desktop.offsetWidth, h: desktop.offsetHeight };
      setIconPositions(prev => {
        const p = prev[id];
        const snapped = snapToGrid(p.left, p.top, bounds);
        const newPos = { ...prev, [id]: snapped };
        saveIconPositions(newPos);
        return newPos;
      });
      draggingRef.current = null;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      const desktop = desktopRef.current;
      if (!desktop) return;
      const bounds = { w: desktop.offsetWidth, h: desktop.offsetHeight };
      const saved = loadIconPositions();
      if (!saved) return;
      const updated = {};
      Object.keys(saved).forEach(id => {
        updated[id] = snapToGrid(saved[id].left, saved[id].top, bounds);
      });
      saveIconPositions(updated);
      setIconPositions(updated);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleIconMouseDown = (e, id) => {
    if (e.button !== 0) return;
    didDragRef.current = false;
    const p = iconPositions[id] || { left: 0, top: 0 };
    draggingRef.current = { id, startX: e.clientX, startY: e.clientY, startLeft: p.left, startTop: p.top };
    e.preventDefault();
  };

  const handleIconClick = (e, id) => {
    if (didDragRef.current) return;
    playOSSound('click');
    setSelectedIcon(id);
  };

  const handleIconDblClick = (e, id) => {
    if (didDragRef.current) { e.preventDefault(); e.stopPropagation(); return; }
    openWindow(id);
  };

  const handleDesktopClick = (e) => {
    if (!e.target.closest('.icon')) setSelectedIcon(null);
  };

  return (
    <div
      id="desktop"
      ref={desktopRef}
      onContextMenu={(e) => onContextMenu(e, 'desktop')}
      onClick={handleDesktopClick}
      style={{ visibility: 'visible' }}
    >
      <div className="desktop-icons">
        {DESKTOP_ICONS.map(icon => {
          const pos = iconPositions[icon.id];
          if (!pos) return null;
          const isDragging = draggingRef.current?.id === icon.id;
          return (
            <div
              key={icon.id}
              className={`icon icon-${icon.id} ${selectedIcon === icon.id ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
              data-app={icon.id}
              style={{ left: pos.left + 'px', top: pos.top + 'px' }}
              onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
              onClick={(e) => handleIconClick(e, icon.id)}
              onDoubleClick={(e) => handleIconDblClick(e, icon.id)}
            >
              <div className={`icon-img ${icon.colorClass}`}>
                <i className={icon.iconClass}></i>
              </div>
              <div className="icon-label">{icon.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
