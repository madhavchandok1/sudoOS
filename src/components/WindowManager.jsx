import { useEffect, useRef, useCallback } from 'react';
import AppWindow from './AppWindow';
import AboutApp from './apps/AboutApp';
import SkillsApp from './apps/SkillsApp';
import ProjectsApp from './apps/ProjectsApp';
import ContactApp from './apps/ContactApp';
import TerminalApp from './apps/TerminalApp';
import SnakeApp from './apps/SnakeApp';
import NotepadApp from './apps/NotepadApp';
import FilesApp from './apps/FilesApp';
import SettingsApp from './apps/SettingsApp';

const WINDOWS_CONFIG = {
  about: { title: '<i class="fa-solid fa-user-astronaut"></i> about_me.txt', defaultWidth: 510, defaultTop: 80, defaultLeft: 160 },
  skills: { title: '<i class="fa-solid fa-laptop-code"></i> skills.json', defaultWidth: 550, defaultTop: 100, defaultLeft: 210 },
  projects: { title: '<i class="fa-solid fa-folder-tree"></i> projects/', defaultWidth: 510, defaultTop: 90, defaultLeft: 240 },
  contact: { title: '<i class="fa-solid fa-paper-plane"></i> contact.sh', defaultWidth: 410, defaultTop: 110, defaultLeft: 200 },
  terminal: { title: '<i class="fa-solid fa-terminal"></i> terminal — bash', defaultWidth: 560, defaultTop: 130, defaultLeft: 175 },
  snake: { title: '<i class="fa-solid fa-dragon"></i> Snake.exe — Arrow keys / WASD / D-pad', defaultWidth: 470, defaultTop: 80, defaultLeft: 200 },
  notepad: { title: '<i class="fa-solid fa-pen-to-square"></i> Untitled — Notepad', defaultWidth: 500, defaultTop: 120, defaultLeft: 190 },
  files: { title: '<i class="fa-regular fa-folder-open"></i> File Manager', defaultWidth: 560, defaultTop: 100, defaultLeft: 180 },
  settings: { title: '<i class="fa-solid fa-sliders"></i> System Settings', defaultWidth: 580, defaultTop: 80, defaultLeft: 200 },
};

export default function WindowManager({
  windows, focusedWindow,
  openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow,
  updateWindowPos, updateWindowSize,
  triggerNotif, wallpaper, setWallpaper, accentColor, setAccentColor,
  fpsVisible, setFpsVisible, nightLight, setNightLight
}) {
  const snakePauseRef = useRef(null);

  const renderApp = (id) => {
    switch (id) {
      case 'about': return <AboutApp />;
      case 'skills': return <SkillsApp />;
      case 'projects': return <ProjectsApp />;
      case 'contact': return <ContactApp />;
      case 'terminal': return <TerminalApp openWindow={openWindow} triggerNotif={triggerNotif} />;
      case 'snake': return <SnakeApp triggerNotif={triggerNotif} pauseRef={snakePauseRef} />;
      case 'notepad': return <NotepadApp triggerNotif={triggerNotif} />;
      case 'files': return <FilesApp openWindow={openWindow} triggerNotif={triggerNotif} />;
      case 'settings': return (
        <SettingsApp
          triggerNotif={triggerNotif}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          fpsVisible={fpsVisible}
          setFpsVisible={setFpsVisible}
        />
      );
      default: return null;
    }
  };

  return (
    <>
      {Object.keys(WINDOWS_CONFIG).map(id => {
        const cfg = WINDOWS_CONFIG[id];
        const winState = windows[id] || {};
        const isVisible = winState.visible || false;
        const isClosing = winState.closing || false;
        const isFocused = focusedWindow === id;

        return (
          <AppWindow
            key={id}
            id={id}
            title={cfg.title}
            visible={isVisible}
            closing={isClosing}
            focused={isFocused}
            x={winState.x || cfg.defaultLeft + 'px'}
            y={winState.y || cfg.defaultTop + 'px'}
            width={winState.width || cfg.defaultWidth + 'px'}
            height={winState.height}
            zIndex={winState.zIndex || 100}
            isMax={winState._max}
            onClose={() => {
              if (id === 'snake' && snakePauseRef.current) snakePauseRef.current(true);
              closeWindow(id);
            }}
            onMinimize={() => {
              if (id === 'snake' && snakePauseRef.current) snakePauseRef.current(true);
              minimizeWindow(id);
            }}
            onMaximize={() => maximizeWindow(id)}
            onFocus={() => focusWindow(id)}
            onUpdatePos={(x, y) => updateWindowPos(id, x, y)}
            onUpdateSize={(w, h) => updateWindowSize(id, w, h)}
          >
            {renderApp(id)}
          </AppWindow>
        );
      })}
    </>
  );
}
