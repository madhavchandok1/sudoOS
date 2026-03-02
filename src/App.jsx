import { useState, useEffect, useCallback, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import WindowManager from './components/WindowManager';
import ContextMenu from './components/ContextMenu';
import NotifStack from './components/NotifStack';
import StartMenu from './components/StartMenu';
import CalendarPopup from './components/CalendarPopup';
import HiddenIconsPopup from './components/HiddenIconsPopup';
import FpsCounter from './components/FpsCounter';
import MobileBlock from './components/MobileBlock';
import { APP_NAMES } from './utils/constants';
import { playOSSound, setMuted, getMuted } from './utils/sound';

export default function App() {
  const [phase, setPhase] = useState('welcome'); // welcome | boot | desktop
  const [windows, setWindows] = useState({});
  const [focusedWindow, setFocusedWindow] = useState(null);
  const [taskbarApps, setTaskbarApps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hiddenIconsOpen, setHiddenIconsOpen] = useState(false);
  const [ctxMenu, setCtxMenu] = useState({ visible: false, x: 0, y: 0, target: null });
  const [isMutedState, setIsMutedState] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [fpsVisible, setFpsVisible] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [wallpaper, setWallpaper] = useState('nebula');
  const [accentColor, setAccentColor] = useState({ accent: '#00bcd4', accent2: '#006064' });
  const zTopRef = useRef(200);
  const savedPosRef = useRef({});
  const notifIdRef = useRef(0);

  useEffect(() => {
    if (accentColor.accent) {
      document.documentElement.style.setProperty('--accent', accentColor.accent);
      document.documentElement.style.setProperty('--accent2', accentColor.accent2);
      const rgb = accentColor.accent.slice(1).match(/../g).map(x => parseInt(x, 16));
      document.documentElement.style.setProperty('--border', `rgba(${rgb[0]},${rgb[1]},${rgb[2]},.22)`);
    }
  }, [accentColor]);

  useEffect(() => {
    document.body.className = `wp-${wallpaper}`;
  }, [wallpaper]);

  useEffect(() => {
    document.body.style.filter = nightLight ? 'sepia(0.3) hue-rotate(-15deg)' : '';
  }, [nightLight]);

  const triggerNotif = useCallback((icon, title, body, ms = 4000) => {
    const id = ++notifIdRef.current;
    setNotifications(prev => [...prev, { id, icon, title, body }]);
    setTimeout(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, out: true } : n));
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 350);
    }, ms);
  }, []);

  const dismissNotif = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, out: true } : n));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 350);
  }, []);

  const openWindow = useCallback((id) => {
    const isVisible = windows[id]?.visible;
    if (!isVisible) {
      playOSSound('open');
      const visibleCount = Object.values(windows).filter(w => w.visible).length;
      const savedPos = savedPosRef.current[id];
      const pos = savedPos || {
        x: (150 + visibleCount * 28) + 'px',
        y: (62 + visibleCount * 22) + 'px',
      };
      setWindows(prev => ({
        ...prev,
        [id]: { ...prev[id], visible: true, x: pos.x, y: pos.y }
      }));
      setTaskbarApps(prev => prev.includes(id) ? prev : [...prev, id]);
    }
    setFocusedWindow(id);
    zTopRef.current++;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], visible: true, zIndex: zTopRef.current }
    }));
  }, [windows]);

  const closeWindow = useCallback((id) => {
    setWindows(prev => {
      const w = prev[id];
      if (w) savedPosRef.current[id] = { x: w.x, y: w.y };
      return { ...prev, [id]: { ...prev[id], closing: true, focused: false } };
    });
    playOSSound('close');
    setFocusedWindow(prev => prev === id ? null : prev);
    setTimeout(() => {
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], visible: false, closing: false } }));
      setTaskbarApps(prev => prev.filter(a => a !== id));
    }, 280);
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => {
      const w = prev[id];
      if (w) savedPosRef.current[id] = { x: w.x, y: w.y };
      return { ...prev, [id]: { ...prev[id], closing: true, focused: false } };
    });
    playOSSound('close');
    setFocusedWindow(prev => prev === id ? null : prev);
    setTimeout(() => {
      setWindows(prev => ({ ...prev, [id]: { ...prev[id], visible: false, closing: false } }));
    }, 280);
  }, []);

  const maximizeWindow = useCallback((id) => {
    setWindows(prev => {
      const w = prev[id] || {};
      if (w._max) {
        return {
          ...prev,
          [id]: { ...w, x: w._prevX, y: w._prevY, width: w._prevW, height: w._prevH, _max: false }
        };
      } else {
        return {
          ...prev,
          [id]: { ...w, _prevX: w.x, _prevY: w.y, _prevW: w.width, _prevH: w.height, x: '0', y: '0', width: '100vw', height: 'calc(100vh - 48px)', _max: true }
        };
      }
    });
  }, []);

  const focusWindow = useCallback((id) => {
    zTopRef.current++;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: zTopRef.current }
    }));
    setFocusedWindow(id);
  }, []);

  const updateWindowPos = useCallback((id, x, y) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], x, y } }));
  }, []);

  const updateWindowSize = useCallback((id, width, height) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], width, height } }));
  }, []);

  const handleTaskbarClick = useCallback((id) => {
    playOSSound('click');
    const w = windows[id];
    if (w && w.visible) {
      if (focusedWindow === id) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    } else {
      openWindow(id);
    }
  }, [windows, focusedWindow, openWindow, focusWindow, minimizeWindow]);

  const handleContextMenu = useCallback((e, target) => {
    e.preventDefault();
    playOSSound('click');
    setCtxMenu({ visible: true, x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 200), target });
    setStartMenuOpen(false);
  }, []);

  const hideCtx = useCallback(() => {
    setCtxMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  const toggleCalendar = useCallback(() => {
    setCalendarOpen(prev => !prev);
  }, []);

  const toggleHiddenIcons = useCallback(() => {
    setHiddenIconsOpen(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !isMutedState;
    setIsMutedState(newMuted);
    setMuted(newMuted);
    triggerNotif(
      newMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>',
      'Sound',
      `System volume is now ${newMuted ? 'muted' : 'unmuted'}.`
    );
  }, [isMutedState, triggerNotif]);

  const toggleNetwork = useCallback(() => {
    setIsOnline(prev => {
      const newOnline = !prev;
      const iconHtml = newOnline ? '<i class="fa-solid fa-wifi"></i>' : '<i class="fa-solid fa-plane"></i>';
      const label = newOnline ? 'Connected to Wi-Fi' : 'Airplane mode enabled';
      triggerNotif(iconHtml, 'Network Status', label);
      return newOnline;
    });
  }, [triggerNotif]);

  const launchOS = useCallback(() => {
    setPhase('boot');
  }, []);

  const onBootComplete = useCallback(() => {
    setPhase('desktop');
    triggerNotif('<i class="fa-solid fa-bolt" style="color:#ffcc00"></i>', 'Welcome to sudoOS', 'Double-click icons · Alt+1–9 for shortcuts');
    setTimeout(() => triggerNotif('<i class="fa-solid fa-lightbulb" style="color:#ffffff; filter: drop-shadow(0 0 6px rgba(255,255,255,0.8));"></i>', 'Tip', 'Alt+1–9 to instantly open any app!'), 6000);
  }, [triggerNotif]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!e.altKey) return;
      const map = { '1': 'about', '2': 'skills', '3': 'projects', '4': 'contact', '5': 'terminal', '6': 'snake', '7': 'notepad', '8': 'files', '9': 'settings' };
      if (map[e.key]) { e.preventDefault(); openWindow(map[e.key]); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openWindow]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (calendarOpen && !e.target.closest('#calendar-popup') && !e.target.closest('#clock-wrap')) {
        setCalendarOpen(false);
      }
      if (hiddenIconsOpen && !e.target.closest('#hidden-icons-popup') && !e.target.closest('#hidden-icons-btn')) {
        setHiddenIconsOpen(false);
      }
      if (startMenuOpen && !e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
        setStartMenuOpen(false);
      }
      hideCtx();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [calendarOpen, hiddenIconsOpen, startMenuOpen, hideCtx]);

  const sharedProps = {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    triggerNotif,
    windows,
    focusedWindow,
    updateWindowPos,
    updateWindowSize,
    wallpaper,
    setWallpaper,
    accentColor,
    setAccentColor,
    fpsVisible,
    setFpsVisible,
    nightLight,
    setNightLight,
  };

  return (
    <>
      <MobileBlock />
      {phase === 'welcome' && <WelcomeScreen onLaunch={launchOS} />}
      {phase === 'boot' && <BootScreen onComplete={onBootComplete} />}
      {phase === 'desktop' && (
        <>
          <Desktop
            onContextMenu={handleContextMenu}
            openWindow={openWindow}
            triggerNotif={triggerNotif}
          />
          <WindowManager {...sharedProps} />
          <Taskbar
            taskbarApps={taskbarApps}
            focusedWindow={focusedWindow}
            onTaskbarClick={handleTaskbarClick}
            startMenuOpen={startMenuOpen}
            onToggleStartMenu={toggleStartMenu}
            onToggleCalendar={toggleCalendar}
            onToggleHiddenIcons={toggleHiddenIcons}
            onToggleMute={toggleMute}
            onToggleNetwork={toggleNetwork}
            isMuted={isMutedState}
            isOnline={isOnline}
            windows={windows}
          />
          <StartMenu
            visible={startMenuOpen}
            openWindow={(id) => { openWindow(id); setStartMenuOpen(false); }}
            onShutdown={() => {
              triggerNotif('<i class="fa-solid fa-power-off"></i>', 'sudoOS', "Shutting down... just kidding! 😄");
              setStartMenuOpen(false);
            }}
          />
          <CalendarPopup visible={calendarOpen} />
          <HiddenIconsPopup
            visible={hiddenIconsOpen}
            triggerNotif={triggerNotif}
            nightLight={nightLight}
            setNightLight={setNightLight}
          />
          <ContextMenu
            visible={ctxMenu.visible}
            x={ctxMenu.x}
            y={ctxMenu.y}
            target={ctxMenu.target}
            openWindow={(id) => { openWindow(id); hideCtx(); }}
            onHide={hideCtx}
            triggerNotif={triggerNotif}
          />
          <FpsCounter visible={fpsVisible} />
        </>
      )}
      <NotifStack notifications={notifications} onDismiss={dismissNotif} />
    </>
  );
}
