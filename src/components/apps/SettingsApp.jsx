import { useState, useEffect } from 'react';

const WALLPAPERS = [
  { name: 'nebula', style: { background: 'radial-gradient(ellipse at 20% 80%,rgba(83,52,131,.9),#0a0a14)' }, title: 'Nebula' },
  { name: 'ocean',  style: { background: 'radial-gradient(ellipse at 20% 80%,rgba(0,60,120,.95),#03040f)' }, title: 'Ocean' },
  { name: 'forest', style: { background: 'radial-gradient(ellipse at 20% 80%,rgba(20,80,30,.95),#050f06)' }, title: 'Forest' },
  { name: 'sunset', style: { background: 'radial-gradient(ellipse at 50% 100%,rgba(200,80,20,.95),#0f0508)' }, title: 'Sunset' },
  { name: 'mono',   style: { background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'white' }, title: 'Mono', mono: true },
];

const ACCENTS = [
  { accent: '#e94560', accent2: '#533483', title: 'Red' },
  { accent: '#00bcd4', accent2: '#006064', title: 'Cyan' },
  { accent: '#7c4dff', accent2: '#311b92', title: 'Purple' },
  { accent: '#00e676', accent2: '#00600f', title: 'Green' },
  { accent: '#ff9100', accent2: '#e65100', title: 'Orange' },
  { accent: '#f50057', accent2: '#880e4f', title: 'Pink' },
];

export default function SettingsApp({
  triggerNotif, wallpaper, setWallpaper,
  accentColor, setAccentColor, fpsVisible, setFpsVisible
}) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [res, setRes] = useState('—');

  useEffect(() => {
    setRes(`${window.innerWidth}×${window.innerHeight}`);
  }, []);

  const handleSetWP = (name) => {
    setWallpaper(name);
    triggerNotif('<i class="fa-solid fa-palette"></i>', 'Wallpaper', name.charAt(0).toUpperCase() + name.slice(1) + ' wallpaper applied.');
  };

  const handleSetAccent = (acc) => {
    setAccentColor({ accent: acc.accent, accent2: acc.accent2 });
    triggerNotif('<i class="fa-solid fa-palette"></i>', 'Accent Color', 'New accent color applied system-wide.');
  };

  const tabs = ['appearance', 'system', 'about'];

  return (
    <div className="window-body nop" style={{ padding: 0, display: 'flex', minHeight: '390px' }}>
      <div className="settings-sidebar">
        <div className={`settings-nav-item${activeTab === 'appearance' ? ' active' : ''}`} onClick={() => setActiveTab('appearance')}>
          <i className="fa-solid fa-palette"></i> Appearance
        </div>
        <div className={`settings-nav-item${activeTab === 'system' ? ' active' : ''}`} onClick={() => setActiveTab('system')}>
          <i className="fa-solid fa-desktop"></i> System
        </div>
        <div className={`settings-nav-item${activeTab === 'about' ? ' active' : ''}`} onClick={() => setActiveTab('about')}>
          <i className="fa-solid fa-circle-info"></i> About
        </div>
      </div>

      <div className="settings-panel">
        {activeTab === 'appearance' && (
          <div id="stab-appearance">
            <h2>Appearance</h2>
            <div className="settings-section">
              <h3>Wallpaper</h3>
              <div className="wallpaper-grid">
                {WALLPAPERS.map(wp => (
                  <div
                    key={wp.name}
                    className={`wp-option${wallpaper === wp.name ? ' active' : ''}`}
                    style={wp.style}
                    onClick={() => handleSetWP(wp.name)}
                    title={wp.title}
                  >
                    {wp.mono && <i className="fa-solid fa-square"></i>}
                  </div>
                ))}
              </div>
            </div>
            <div className="settings-section">
              <h3>Accent Color</h3>
              <div className="accent-palette">
                {ACCENTS.map(acc => (
                  <div
                    key={acc.accent}
                    className={`accent-dot${accentColor.accent === acc.accent ? ' active' : ''}`}
                    style={{ background: acc.accent }}
                    onClick={() => handleSetAccent(acc)}
                    title={acc.title}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div id="stab-system">
            <h2>System</h2>
            <div className="settings-section">
              <h3>Preferences</h3>
              <ToggleRow label="Window animations" sub="Smooth open/close effects" defaultOn={true} />
              <ToggleRow label="Notifications" sub="Show system notifications" defaultOn={true} />
              <ToggleRow label="Sound" sub="UI interaction sounds" defaultOn={false} />
            </div>
            <div className="settings-section">
              <h3>Developer</h3>
              <div className="setting-row">
                <div className="setting-label">Show FPS counter</div>
                <div
                  className={`toggle${fpsVisible ? ' on' : ''}`}
                  id="fps-toggle"
                  onClick={() => setFpsVisible(prev => !prev)}
                ></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div id="stab-about">
            <h2>About sudoOS</h2>
            <div className="settings-section">
              <h3>System Info</h3>
              <div className="setting-row">
                <div className="setting-label">OS Version</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>sudoOS 1.0.0</div>
              </div>
              <div className="setting-row">
                <div className="setting-label">Build Date</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>2026.03.01</div>
              </div>
              <div className="setting-row">
                <div className="setting-label">Engine</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Browser Native</div>
              </div>
              <div className="setting-row">
                <div className="setting-label">Developer</div>
                <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Madhav Chandok</div>
              </div>
              <div className="setting-row">
                <div className="setting-label">Resolution</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} id="res-label">{res}</div>
              </div>
            </div>
            <div className="settings-section">
              <h3>Credits</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.9' }}>
                Built with pure HTML, CSS &amp; JavaScript.<br />
                No frameworks · No dependencies · Just vibes ✨<br /><br />
                <strong style={{ color: 'var(--text)' }}>Keyboard shortcuts:</strong> Alt + 1–9 to open apps
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="setting-row">
      <div>
        <div className="setting-label">{label}</div>
        <div className="setting-sub">{sub}</div>
      </div>
      <div className={`toggle${on ? ' on' : ''}`} onClick={() => setOn(p => !p)}></div>
    </div>
  );
}
