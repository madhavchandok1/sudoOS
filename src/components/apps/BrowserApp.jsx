import { useState, useRef, useCallback, useEffect } from 'react';
import { playOSSound } from '../../utils/sound';

const BOOKMARKS = [
  { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com/in/madhavchandok', color: '#0077b5' },
  { label: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/madhavchandok', color: '#ffffff' },
  { label: 'Portfolio', icon: 'fa-solid fa-globe', url: 'https://madhavchandok.dev', color: '#e94560' },
];

// Free CORS proxy services — if one fails, we try the next
const PROXY_SERVICES = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

function toProxyUrl(targetUrl) {
  return PROXY_SERVICES[0](targetUrl);
}

export default function BrowserApp() {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [loadState, setLoadState] = useState('home');
  const [proxyAttempt, setProxyAttempt] = useState(0);
  const iframeRef = useRef(null);
  const loadTimerRef = useRef(null);

  const openExternal = (targetUrl) => {
    playOSSound('click');
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const navigate = useCallback((targetUrl) => {
    if (!targetUrl) return;
    let finalUrl = targetUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    playOSSound('click');
    setLoading(true);
    setLoadState('loading');
    setCurrentUrl(finalUrl);
    setUrl(finalUrl);
    setProxyAttempt(0);
    setIframeSrc(toProxyUrl(finalUrl));

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setLoadState(prev => prev === 'loading' ? 'timeout' : prev);
      setLoading(false);
    }, 10000);
  }, [history, historyIndex]);

  useEffect(() => {
    return () => clearTimeout(loadTimerRef.current);
  }, []);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      playOSSound('click');
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];
      setCurrentUrl(prevUrl);
      setUrl(prevUrl);
      setProxyAttempt(0);
      setLoadState('loading');
      setLoading(true);
      setIframeSrc(toProxyUrl(prevUrl));
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = setTimeout(() => {
        setLoadState(prev => prev === 'loading' ? 'timeout' : prev);
        setLoading(false);
      }, 10000);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      playOSSound('click');
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setCurrentUrl(nextUrl);
      setUrl(nextUrl);
      setProxyAttempt(0);
      setLoadState('loading');
      setLoading(true);
      setIframeSrc(toProxyUrl(nextUrl));
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = setTimeout(() => {
        setLoadState(prev => prev === 'loading' ? 'timeout' : prev);
        setLoading(false);
      }, 10000);
    }
  }, [history, historyIndex]);

  const refresh = useCallback(() => {
    if (currentUrl) {
      playOSSound('click');
      setProxyAttempt(0);
      setLoadState('loading');
      setLoading(true);
      setIframeSrc(toProxyUrl(currentUrl));
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = setTimeout(() => {
        setLoadState(prev => prev === 'loading' ? 'timeout' : prev);
        setLoading(false);
      }, 10000);
    }
  }, [currentUrl]);

  const tryNextProxy = useCallback(() => {
    if (proxyAttempt < PROXY_SERVICES.length - 1) {
      const next = proxyAttempt + 1;
      setProxyAttempt(next);
      setIframeSrc(PROXY_SERVICES[next](currentUrl));
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = setTimeout(() => {
        setLoadState(prev => prev === 'loading' ? 'blocked' : prev);
        setLoading(false);
      }, 8000);
    } else {
      setLoadState('blocked');
      setLoading(false);
    }
  }, [proxyAttempt, currentUrl]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(url);
    }
  };

  const handleIframeLoad = () => {
    clearTimeout(loadTimerRef.current);
    setLoading(false);
    setLoadState('loaded');
  };

  const handleIframeError = () => {
    clearTimeout(loadTimerRef.current);
    setLoading(false);
    // Try next proxy service
    if (proxyAttempt < PROXY_SERVICES.length - 1) {
      tryNextProxy();
    } else {
      setLoadState('blocked');
    }
  };

  const displayUrl = currentUrl
    ? currentUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : '';
  const displayTitle = displayUrl || 'New Tab';

  return (
    <div className="browser-app">
      <div className="browser-toolbar">
        <div className="browser-nav-btns">
          <button className="browser-nav-btn" onClick={goBack} disabled={historyIndex <= 0} title="Back">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="browser-nav-btn" onClick={goForward} disabled={historyIndex >= history.length - 1} title="Forward">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <button className="browser-nav-btn" onClick={refresh} disabled={!currentUrl} title="Refresh">
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
        <div className="browser-address-bar">
          <i className="fa-solid fa-lock browser-lock"></i>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter URL..."
            className="browser-url-input"
          />
        </div>
        {currentUrl && (
          <button className="browser-external-btn" onClick={() => openExternal(currentUrl)} title="Open in real browser">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        )}
      </div>
      <div className="browser-tab-bar">
        <div className={`browser-tab active${loading ? ' loading' : ''}`}>
          <i className="fa-solid fa-globe" style={{ fontSize: '10px', opacity: .6 }}></i>
          <span>{displayTitle}</span>
          {loading && <span className="browser-tab-spinner"></span>}
        </div>
      </div>
      <div className="browser-bookmarks">
        {BOOKMARKS.map((bm) => (
          <button key={bm.label} className="browser-bookmark" onClick={() => navigate(bm.url)}>
            <i className={bm.icon} style={{ color: bm.color }}></i>
            <span>{bm.label}</span>
          </button>
        ))}
      </div>
      <div className="browser-viewport">
        {loading && (
          <div className="browser-loading">
            <div className="browser-loading-bar"></div>
          </div>
        )}
        {currentUrl && loadState !== 'blocked' && loadState !== 'timeout' && loadState !== 'home' ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="browser-iframe"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            title={displayTitle}
          />
        ) : (
          <div className="browser-home">
            {loadState === 'blocked' || loadState === 'timeout' ? (
              <div className="browser-blocked">
                <div className="browser-blocked-icon">
                  <i className="fa-solid fa-plug-circle-xmark"></i>
                </div>
                <h3>Couldn't load this page</h3>
                <p className="browser-blocked-url">{displayUrl}</p>
                <p>
                  {loadState === 'timeout'
                    ? 'The page took too long to respond.'
                    : 'The proxy service couldn\'t retrieve this page.'}
                </p>
                <div className="browser-blocked-actions">
                  <button className="browser-open-external" onClick={() => openExternal(currentUrl)}>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Open in real browser
                  </button>
                  <button className="browser-retry-btn" onClick={refresh}>
                    <i className="fa-solid fa-rotate-right"></i> Retry
                  </button>
                </div>
              </div>
            ) : (
              <div className="browser-start-page">
                <div className="browser-start-logo">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <h2>sudoOS Browser</h2>
                <p>Navigate to a site or pick a bookmark below.</p>
                <p className="browser-hint">Sites are loaded via a proxy to bypass iframe restrictions.</p>
                <div className="browser-start-links">
                  {BOOKMARKS.map((bm) => (
                    <button key={bm.label} className="browser-start-link" onClick={() => navigate(bm.url)}>
                      <i className={bm.icon} style={{ color: bm.color }}></i>
                      <span>{bm.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
