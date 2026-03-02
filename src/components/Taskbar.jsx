import { useState, useEffect } from 'react';
import { playOSSound } from '../utils/sound';

function formatTime(now) {
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(now) {
  const d = now.getDate().toString().padStart(2, '0');
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const y = now.getFullYear();
  return `${d}-${m}-${y}`;
}

export default function Taskbar({
  taskbarApps, focusedWindow, onTaskbarClick,
  startMenuOpen, onToggleStartMenu, onToggleCalendar,
  onToggleHiddenIcons, onToggleMute, onToggleNetwork,
  isMuted, isOnline, windows
}) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return { time: formatTime(now), date: formatDate(now) };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime({ time: formatTime(now), date: formatDate(now) });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="taskbar" style={{ visibility: 'visible' }}>
      <span className="taskbar-logo">sudoOS</span>
      <div className="taskbar-divider"></div>
      <div className="taskbar-center">
        <div className="start-btn-wrap">
          <span
            className={`start-btn${startMenuOpen ? ' active' : ''}`}
            id="start-btn"
            onClick={() => {
              playOSSound('click');
              onToggleStartMenu();
            }}
            title="Start Menu"
          >
            <i className="fa-solid fa-fingerprint"></i>
          </span>
        </div>
        <div id="taskbar-apps">
          {taskbarApps.map(id => (
            <button
              key={id}
              className={`taskbar-app${focusedWindow === id ? ' active' : ''}${windows?.[id]?.closing ? ' closing' : ''}`}
              data-id={id}
              onClick={() => {
                playOSSound('click');
                onTaskbarClick(id);
              }}
            >
              <div className="taskbar-app-icon">
                <i className={getAppIcon(id)}></i>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="taskbar-right">
        <span
          className="taskbar-icon"
          id="hidden-icons-btn"
          onClick={() => {
            playOSSound('click');
            onToggleHiddenIcons();
          }}
          title="Show hidden icons"
        >
          <i className="fa-solid fa-chevron-up" style={{ fontSize: '11px' }}></i>
        </span>
        <div className="taskbar-sys">
          <span
            className="taskbar-icon"
            id="network-icon"
            onClick={() => {
              playOSSound('click');
              onToggleNetwork();
            }}
            title={isOnline ? 'WiFi Connected' : 'Airplane Mode'}
          >
            <i className={`fa-solid ${isOnline ? 'fa-wifi' : 'fa-plane'}`}></i>
          </span>
          <span
            className="taskbar-icon"
            id="vol-icon"
            onClick={() => {
              playOSSound('click');
              onToggleMute();
            }}
            title="Volume"
          >
            <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
          </span>
          <span className="taskbar-icon" id="battery-icon" title="Battery: 78% remaining">
            <i className="fa-solid fa-battery-half"></i>
          </span>
        </div>
        <div
          className="taskbar-clock-wrap"
          id="clock-wrap"
          title="Calendar"
          onClick={() => {
            playOSSound('click');
            onToggleCalendar();
          }}
        >
          <span className="taskbar-time" id="clock-time">{time.time}</span>
          <span className="taskbar-date" id="clock-date">{time.date}</span>
        </div>
      </div>
    </div>
  );
}

function getAppIcon(id) {
  const icons = {
    about: 'fa-solid fa-user-astronaut',
    skills: 'fa-solid fa-laptop-code',
    projects: 'fa-solid fa-folder-tree',
    contact: 'fa-solid fa-paper-plane',
    terminal: 'fa-solid fa-terminal',
    snake: 'fa-solid fa-dragon',
    notepad: 'fa-solid fa-pen-to-square',
    files: 'fa-solid fa-folder-open',
    settings: 'fa-solid fa-sliders'
  };
  return icons[id] || 'fa-solid fa-window-maximize';
}
