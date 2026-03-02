export default function ContextMenu({ visible, x, y, target, openWindow, onHide, triggerNotif }) {
  const isDesktop = target === 'desktop';

  return (
    <div
      id="ctx-menu"
      className={visible ? 'visible' : ''}
      style={{ left: x + 'px', top: y + 'px' }}
    >
      {!isDesktop && (
        <>
          <div className="ctx-item" id="ctx-open" onClick={() => { openWindow(target); }}>
            <i className="fa-regular fa-folder-open" style={{ marginRight: '4px' }}></i> Open
          </div>
          <div className="ctx-sep"></div>
        </>
      )}
      <div className="ctx-item" onClick={() => openWindow('settings')}>
        <i className="fa-solid fa-gear" style={{ marginRight: '4px' }}></i> Settings
      </div>
      <div className="ctx-item" onClick={() => openWindow('terminal')}>
        <i className="fa-solid fa-terminal" style={{ marginRight: '4px' }}></i> Terminal
      </div>
      <div className="ctx-item" onClick={() => openWindow('notepad')}>
        <i className="fa-solid fa-pen-to-square" style={{ marginRight: '4px' }}></i> New Note
      </div>
      <div className="ctx-sep"></div>
      <div className="ctx-item" onClick={() => { triggerNotif('<i class="fa-solid fa-rotate-right"></i>', 'Refreshed', 'Desktop refreshed.'); onHide(); }}>
        <i className="fa-solid fa-rotate-right" style={{ marginRight: '4px' }}></i> Refresh Desktop
      </div>
    </div>
  );
}
