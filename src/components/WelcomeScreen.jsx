export default function WelcomeScreen({ onLaunch }) {
  return (
    <div id="welcome-screen">
      <div className="welcome-bg-orb orb1"></div>
      <div className="welcome-bg-orb orb2"></div>
      <div className="welcome-bg-orb orb3"></div>
      <div className="welcome-content">
        <div className="welcome-badge">Portfolio · 2026</div>
        <h1 className="welcome-title">sudo<span>OS</span></h1>
        <p className="welcome-tagline">A fully interactive desktop experience — built entirely in the browser.</p>
        <div className="welcome-features">
          <div className="welcome-feat"><i className="fa-solid fa-window-restore"></i><span>Draggable Windows</span></div>
          <div className="welcome-feat"><i className="fa-solid fa-terminal"></i><span>Live Terminal</span></div>
          <div className="welcome-feat"><i className="fa-solid fa-palette"></i><span>Themeable UI</span></div>
          <div className="welcome-feat"><i className="fa-solid fa-dragon"></i><span>Snake Game</span></div>
        </div>
        <button className="welcome-launch-btn" onClick={onLaunch}>
          <i className="fa-solid fa-fingerprint"></i>
          Launch sudoOS
        </button>
        <p className="welcome-hint">Best experienced on a desktop browser</p>
      </div>
    </div>
  );
}
