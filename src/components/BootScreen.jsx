import { useEffect, useRef, useState } from 'react';

export default function BootScreen({ onComplete }) {
  const barRef = useRef(null);
  const [status, setStatus] = useState('Initializing…');

  useEffect(() => {
    const bar = barRef.current;
    if (bar) requestAnimationFrame(() => bar.classList.add('run'));

    const msgs = ['Initializing kernel…', 'Mounting filesystem…', 'Loading services…', 'Starting UI…', 'Welcome!'];
    let i = 0;
    const interval = setInterval(() => {
      setStatus(msgs[Math.min(i++, msgs.length - 1)]);
      if (i >= msgs.length) clearInterval(interval);
    }, 500);

    const timeout = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div id="boot" style={{ display: 'flex' }}>
      <div className="boot-logo">sudoOS</div>
      <div className="boot-sub">Portfolio v1.0</div>
      <div className="boot-bar-wrap">
        <div className="boot-bar" ref={barRef}></div>
      </div>
      <div className="boot-status">{status}</div>
    </div>
  );
}
