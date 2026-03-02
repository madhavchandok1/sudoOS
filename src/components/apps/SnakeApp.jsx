import { useEffect, useRef, useState, useCallback } from 'react';

const CELL = 20, COLS = 21, ROWS = 14;

export default function SnakeApp({ triggerNotif, pauseRef }) {
  const canvasRef = useRef(null);
  const snakeRef = useRef([]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 0, y: 0 });
  const gameLoopRef = useRef(null);
  const pausedRef = useRef(false);
  const runningRef = useRef(false);
  const bestScoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(3);
  const [overlay, setOverlay] = useState('start'); // 'start' | 'gameover' | null
  const [goScore, setGoScore] = useState(0);
  const [paused, setPaused] = useState(false);

  // Expose pause function to parent via ref
  useEffect(() => {
    if (pauseRef) {
      pauseRef.current = (force = false) => {
        if (!runningRef.current) return;
        pausedRef.current = force ? true : !pausedRef.current;
        setPaused(pausedRef.current);
      };
    }
  }, [pauseRef]);

  const placeFood = useCallback(() => {
    let f;
    do {
      f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snakeRef.current.some(s => s.x === f.x && s.y === f.y));
    foodRef.current = f;
  }, []);

  const snakeDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const snake = snakeRef.current;
    const food = foodRef.current;
    const dir = dirRef.current;

    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,.025)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(canvas.width, y * CELL); ctx.stroke();
    }

    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 12;
    ctx.font = `${CELL - 2}px serif`;
    ctx.fillText('🍎', food.x * CELL + 1, food.y * CELL + CELL - 2);
    ctx.shadowBlur = 0;

    snake.forEach((seg, i) => {
      const fade = 1 - (i / snake.length) * 0.6;
      if (i === 0) {
        ctx.shadowColor = '#e94560';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#e94560';
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${Math.floor(220 * fade)},${Math.floor(100 * fade)},${Math.floor(80 + 80 * fade)},${fade})`;
      }
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 5 : 3);
      ctx.fill();

      if (i === 0) {
        ctx.shadowBlur = 0;
        const ey  = seg.y * CELL + (dir.y !== 0 ? 9 : 6);
        const ex1 = seg.x * CELL + (dir.y !== 0 ? 5  : dir.x < 0 ? 4  : 12);
        const ex2 = seg.x * CELL + (dir.y !== 0 ? 15 : dir.x < 0 ? 4  : 12);
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ex1, ey, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ex1, ey, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey, 1, 0, Math.PI * 2); ctx.fill();
      }
    });
  }, []);

  const snakeTick = useCallback(() => {
    if (pausedRef.current) return;
    dirRef.current = { ...nextDirRef.current };
    const head = { x: snakeRef.current[0].x + dirRef.current.x, y: snakeRef.current[0].y + dirRef.current.y };
    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = snakeRef.current.some(s => s.x === head.x && s.y === head.y);

    if (hitWall || hitSelf) {
      clearInterval(gameLoopRef.current);
      runningRef.current = false;
      const s = scoreRef.current;
      bestScoreRef.current = Math.max(bestScoreRef.current, s);
      setBestScore(bestScoreRef.current);
      setGoScore(s);
      setOverlay('gameover');
      triggerNotif('💀', 'Game Over', `Score: ${s} · Best: ${bestScoreRef.current}`);
      return;
    }

    snakeRef.current.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      placeFood();
    } else {
      snakeRef.current.pop();
    }
    snakeDraw();
  }, [snakeDraw, placeFood, triggerNotif]);

  const snakeStart = useCallback(() => {
    clearInterval(gameLoopRef.current);
    snakeRef.current = [{ x: 10, y: 6 }, { x: 9, y: 6 }, { x: 8, y: 6 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    pausedRef.current = false;
    runningRef.current = true;
    scoreRef.current = 0;
    setScore(0);
    setPaused(false);
    setOverlay(null);
    placeFood();
    const speeds = [190, 150, 120, 90, 65];
    gameLoopRef.current = setInterval(snakeTick, speeds[speed - 1]);
    triggerNotif('🐍', 'Snake Started!', 'Good luck! Eat the apples.');
  }, [placeFood, snakeTick, speed, triggerNotif]);

  // Restart interval when speed changes mid-game
  useEffect(() => {
    if (runningRef.current) {
      clearInterval(gameLoopRef.current);
      const speeds = [190, 150, 120, 90, 65];
      gameLoopRef.current = setInterval(snakeTick, speeds[speed - 1]);
    }
  }, [speed, snakeTick]);

  const handleDir = useCallback((dx, dy) => {
    if (!runningRef.current) return;
    if (dx !== 0 && dirRef.current.x !== 0) return;
    if (dy !== 0 && dirRef.current.y !== 0) return;
    nextDirRef.current = { x: dx, y: dy };
  }, []);

  const handlePause = useCallback(() => {
    if (!runningRef.current) return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handler = (e) => {
      const keyMap = {
        'ArrowUp': [0, -1], 'ArrowDown': [0, 1], 'ArrowLeft': [-1, 0], 'ArrowRight': [1, 0],
        'w': [0, -1], 's': [0, 1], 'a': [-1, 0], 'd': [1, 0],
      };
      if (keyMap[e.key]) { e.preventDefault(); handleDir(...keyMap[e.key]); }
      if (e.key === ' ') { e.preventDefault(); handlePause(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleDir, handlePause]);

  // Draw idle canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(gameLoopRef.current);
  }, []);

  return (
    <div className="window-body" style={{ padding: '16px' }}>
      <div className="game-ui">
        <div className="game-score">Score <span id="snake-score">{score}</span></div>
        <div className="speed-control">
          Speed{' '}
          <input
            type="range"
            id="snake-speed"
            min="1"
            max="5"
            value={speed}
            style={{ width: '68px' }}
            onChange={e => setSpeed(parseInt(e.target.value))}
          />
          <span id="speed-lbl">{speed}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Best: <span id="snake-best" style={{ color: 'var(--accent)' }}>{bestScore}</span>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'block', lineHeight: 0 }}>
        <canvas ref={canvasRef} id="snake-canvas" width="420" height="280"></canvas>

        {overlay === 'gameover' && (
          <div className="game-over-overlay" id="snake-overlay" style={{ display: 'flex' }}>
            <h2><i className="fa-solid fa-skull"></i> Game Over</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Score: <span id="go-score" style={{ color: 'var(--accent)', fontSize: '18px' }}>{goScore}</span>
            </div>
            <button className="game-btn primary" onClick={snakeStart}>
              <i className="fa-solid fa-play"></i> Play Again
            </button>
          </div>
        )}

        {overlay === 'start' && (
          <div className="game-over-overlay" id="snake-start" style={{ display: 'flex' }}>
            <h2 style={{ fontSize: '24px' }}><i className="fa-solid fa-gamepad"></i> Snake</h2>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.8' }}>
              Arrow keys / WASD to move<br />
              Eat <i className="fa-solid fa-apple-whole" style={{ color: '#e94560' }}></i> to grow · Avoid walls &amp; yourself<br />
              Space to pause
            </div>
            <button className="game-btn primary" onClick={snakeStart}>
              <i className="fa-solid fa-play"></i> Start Game
            </button>
          </div>
        )}
      </div>

      <div className="game-dpad">
        <div></div>
        <div className="dpad-btn" onClick={() => handleDir(0, -1)}><i className="fa-solid fa-caret-up"></i></div>
        <div></div>
        <div className="dpad-btn" onClick={() => handleDir(-1, 0)}><i className="fa-solid fa-caret-left"></i></div>
        <div></div>
        <div className="dpad-btn" onClick={() => handleDir(1, 0)}><i className="fa-solid fa-caret-right"></i></div>
        <div></div>
        <div className="dpad-btn" onClick={() => handleDir(0, 1)}><i className="fa-solid fa-caret-down"></i></div>
        <div></div>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
        <button className="game-btn" id="pause-btn" onClick={handlePause}>
          <i className={`fa-solid ${paused ? 'fa-play' : 'fa-pause'}`}></i> {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="game-btn" onClick={snakeStart}>
          <i className="fa-solid fa-rotate-right"></i> Restart
        </button>
      </div>
    </div>
  );
}
