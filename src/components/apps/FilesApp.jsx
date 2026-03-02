import { useState, useCallback } from 'react';
import { FILESYSTEM } from '../../utils/constants';

export default function FilesApp({ openWindow, triggerNotif }) {
  const [currentPath, setCurrentPath] = useState('~');
  const [pathHistory, setPathHistory] = useState(['~']);
  const [pathForward, setPathForward] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const items = FILESYSTEM[currentPath] || [];
  const displayPath = currentPath.replace('~', '~/Home');
  const count = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  const navigateTo = useCallback((newPath, fromHistory = false) => {
    if (!fromHistory) {
      setPathHistory(prev => [...prev, currentPath]);
      setPathForward([]);
    }
    setCurrentPath(newPath);
    setSelectedFile(null);
  }, [currentPath]);

  const fOpen = useCallback((item) => {
    if (item.t === 'dir') {
      const newPath = currentPath + '/' + item.n;
      if (FILESYSTEM[newPath]) {
        navigateTo(newPath);
      } else {
        triggerNotif('<i class="fa-solid fa-folder"></i>', item.n, 'This folder is empty or not expanded yet.');
      }
    } else {
      triggerNotif('<i class="fa-regular fa-file"></i>', item.n, `Opening ${item.n} (${item.s})…`);
      if (item.n.endsWith('.txt') || item.n.endsWith('.md')) openWindow('notepad');
    }
  }, [currentPath, navigateTo, openWindow, triggerNotif]);

  const filesNav = useCallback((direction) => {
    if (direction === 'back' && pathHistory.length > 1) {
      const prev = pathHistory[pathHistory.length - 1];
      setPathForward(f => [currentPath, ...f]);
      setPathHistory(h => h.slice(0, -1));
      setCurrentPath(prev);
      setSelectedFile(null);
    } else if (direction === 'fwd' && pathForward.length) {
      const next = pathForward[0];
      setPathHistory(h => [...h, currentPath]);
      setPathForward(f => f.slice(1));
      setCurrentPath(next);
      setSelectedFile(null);
    } else if (direction === 'up') {
      const parts = currentPath.split('/');
      if (parts.length > 1) {
        parts.pop();
        const upPath = parts.join('/');
        setPathForward([]);
        setPathHistory(h => [...h, currentPath]);
        setCurrentPath(upPath);
        setSelectedFile(null);
      }
    }
  }, [currentPath, pathHistory, pathForward]);

  const filesRefresh = useCallback(() => {
    setSelectedFile(null);
    triggerNotif('<i class="fa-solid fa-rotate-right"></i>', 'Refreshed', 'Directory listing updated.');
  }, [triggerNotif]);

  return (
    <div className="window-body nop" style={{ display: 'flex', flexDirection: 'column', minHeight: '360px', padding: 0 }}>
      <div className="file-toolbar">
        <button className="file-nav-btn" onClick={() => filesNav('back')} title="Back">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className="file-nav-btn" onClick={() => filesNav('up')} title="Up">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
        <button className="file-nav-btn" onClick={() => filesNav('fwd')} title="Forward">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
        <div className="file-path-bar" id="file-path">{displayPath}</div>
        <button className="file-nav-btn" onClick={filesRefresh} title="Refresh">
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="file-grid" id="file-grid">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`file-item${selectedFile === item.n ? ' selected' : ''}`}
            onClick={() => setSelectedFile(item.n)}
            onDoubleClick={() => fOpen(item)}
          >
            <div className="file-icon" dangerouslySetInnerHTML={{ __html: item.i }}></div>
            <div className="file-name">{item.n}</div>
            <div className="file-size">{item.s}</div>
          </div>
        ))}
      </div>
      <div className="file-statusbar">
        <span id="file-count">{count}</span>
        <span id="file-sel">{selectedFile ? `${selectedFile} selected` : 'Nothing selected'}</span>
      </div>
    </div>
  );
}
