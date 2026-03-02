import { useEffect, useRef } from 'react';

export default function AppWindow({
  id, title, visible, closing, focused, x, y, width, height, zIndex, isMax,
  onClose, onMinimize, onMaximize, onFocus, onUpdatePos, onUpdateSize, children
}) {
  const winRef = useRef(null);
  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const offsetRef = useRef({});
  const resizeStartRef = useRef({});

  useEffect(() => {
    const onMouseMove = (e) => {
      if (draggingRef.current) {
        if (isMax) return;
        const nx = Math.max(0, Math.min(e.clientX - offsetRef.current.ox, window.innerWidth - (winRef.current?.offsetWidth || 300)));
        const ny = Math.max(0, Math.min(e.clientY - offsetRef.current.oy, window.innerHeight - 58));
        onUpdatePos(nx + 'px', ny + 'px');
      }
      if (resizingRef.current) {
        const { sx, sy, sw, sh } = resizeStartRef.current;
        const newW = Math.max(340, sw + (e.clientX - sx));
        const newH = Math.max(200, sh + (e.clientY - sy));
        onUpdateSize(newW + 'px', newH + 'px');
      }
    };
    const onMouseUp = () => {
      draggingRef.current = false;
      resizingRef.current = false;
      document.body.style.cursor = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isMax, onUpdatePos, onUpdateSize]);

  const handleHeaderMouseDown = (e) => {
    if (e.target.classList.contains('wc') || isMax) return;
    const win = winRef.current;
    const r = win.getBoundingClientRect();
    offsetRef.current = { ox: e.clientX - r.left, oy: e.clientY - r.top };
    draggingRef.current = true;
    document.body.style.cursor = 'move';
    onFocus();
  };

  const handleResizeMouseDown = (e) => {
    const win = winRef.current;
    resizeStartRef.current = {
      sx: e.clientX, sy: e.clientY,
      sw: win.offsetWidth, sh: win.offsetHeight
    };
    resizingRef.current = true;
    e.preventDefault();
  };

  const style = {
    left: x,
    top: y,
    width: width,
    zIndex: zIndex,
  };
  if (height) style.height = height;

  return (
    <div
      ref={winRef}
      className={`window${visible ? ' visible' : ''}${closing ? ' closing' : ''}${focused ? ' focused' : ''}`}
      id={`win-${id}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={handleHeaderMouseDown}>
        <div className="window-controls">
          <div className="wc close" onClick={onClose}><i className="fa-solid fa-xmark"></i></div>
          <div className="wc min" onClick={onMinimize}><i className="fa-solid fa-minus"></i></div>
          <div className="wc maxbtn" onClick={onMaximize}><i className="fa-solid fa-maximize"></i></div>
        </div>
        <span className="window-title" dangerouslySetInnerHTML={{ __html: title }}></span>
      </div>
      {children}
      <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
    </div>
  );
}
