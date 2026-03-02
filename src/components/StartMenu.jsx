export default function StartMenu({ visible, openWindow, onShutdown }) {
  const apps = [
    { id: 'about', icon: 'fa-solid fa-user-astronaut', color: '#e94560', name: 'About Me' },
    { id: 'skills', icon: 'fa-solid fa-laptop-code', color: '#7b52ab', name: 'Skills' },
    { id: 'projects', icon: 'fa-solid fa-folder-tree', color: '#00bcd4', name: 'Projects' },
    { id: 'contact', icon: 'fa-solid fa-paper-plane', color: '#00e5ff', name: 'Contact' },
    { id: 'terminal', icon: 'fa-solid fa-terminal', color: '#e8e8f0', name: 'Terminal' },
    { id: 'snake', icon: 'fa-solid fa-dragon', color: '#28c840', name: 'Snake' },
    { id: 'notepad', icon: 'fa-solid fa-pen-to-square', color: '#d4810a', name: 'Notepad' },
    { id: 'files', icon: 'fa-solid fa-folder-open', color: '#1e90ff', name: 'Files' },
    { id: 'settings', icon: 'fa-solid fa-sliders', color: '#ffffff', name: 'Settings' },
  ];

  return (
    <div id="start-menu" className={visible ? 'visible' : ''}>
      <div className="start-menu-header">
        <div className="start-menu-avatar"><i className="fa-solid fa-user-astronaut"></i></div>
        <div className="start-menu-user">
          <div className="start-menu-name">Madhav Chandok</div>
          <div className="start-menu-sub">Full-Stack Developer</div>
        </div>
      </div>
      <div className="start-menu-label">Applications</div>
      <div className="start-menu-grid">
        {apps.map(app => (
          <div key={app.id} className="start-app-item" onClick={() => openWindow(app.id)}>
            <div className="start-app-icon" style={{ color: app.color }}>
              <i className={app.icon}></i>
            </div>
            <div className="start-app-name">{app.name}</div>
          </div>
        ))}
      </div>
      <div className="start-menu-footer">
        <div className="start-footer-btn" onClick={onShutdown}>
          <i className="fa-solid fa-power-off"></i> Shut Down
        </div>
      </div>
    </div>
  );
}
