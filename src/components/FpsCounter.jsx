import { useEffect, useRef, useState } from 'react';

export default function FpsCounter({ visible }) {
  const [fps, setFps] = useState(0);
  const ltRef = useRef(performance.now());
  const frRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const loop = () => {
      frRef.current++;
      const now = performance.now();
      if (now - ltRef.current >= 1000) {
        setFps(Math.round(frRef.current / ((now - ltRef.current) / 1000)));
        frRef.current = 0;
        ltRef.current = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div id="fps-el" style={{ display: visible ? 'block' : 'none' }}>
      {fps} FPS
    </div>
  );
}
