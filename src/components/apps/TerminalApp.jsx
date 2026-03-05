import { useEffect, useRef, useCallback } from 'react';
import { APP_NAMES } from '../../utils/constants';
import { playOSSound } from '../../utils/sound';

const COMMANDS = (openWindow, triggerNotif) => ({
  help: () => [
    '<span class="t-hi">╔══════════ sudoOS Terminal ══════════╗</span>',
    '<span class="t-out">  Apps:  about · skills · projects · contact</span>',
    '<span class="t-out">         snake · notepad · files · settings</span>',
    '<span class="t-out">  Utils: whoami · ls · pwd · date · clear</span>',
    '<span class="t-out">         uname · neofetch · echo · man · open</span>',
    '<span class="t-out">  Tip:   ↑ / ↓ for command history</span>',
  ],
  whoami: () => ['<span class="t-hi">madhav</span> — Full-Stack Developer @ sudoOS'],
  pwd: () => ['<span class="t-out">/home/madhav/portfolio</span>'],
  date: () => [`<span class="t-out">${new Date().toString()}</span>`],
  uname: () => ['<span class="t-out">sudoOS 1.0.0 Browser-Native x64 Portfolio-LTS</span>'],
  ls: () => ['<span class="t-out">about_me.txt  skills.json  projects/  contact.sh  snake.exe  notepad.txt  files/  settings.cfg</span>'],
  clear: (_, outputRef) => {
    if (outputRef && outputRef.current) outputRef.current.innerHTML = '';
    return [];
  },
  about:    () => { openWindow('about');    return ['<span class="t-out">→ Opening About Me…</span>']; },
  skills:   () => { openWindow('skills');   return ['<span class="t-out">→ Opening Skills…</span>']; },
  projects: () => { openWindow('projects'); return ['<span class="t-out">→ Opening Projects…</span>']; },
  contact:  () => { openWindow('contact');  return ['<span class="t-out">→ Opening Contact…</span>']; },
  snake:    () => { openWindow('snake');    return ['<span class="t-out">→ Launching Snake…</span>']; },
  notepad:  () => { openWindow('notepad');  return ['<span class="t-out">→ Opening Notepad…</span>']; },
  files:    () => { openWindow('files');    return ['<span class="t-out">→ Opening File Manager…</span>']; },
  settings: () => { openWindow('settings'); return ['<span class="t-out">→ Opening Settings…</span>']; },
  open: (args) => {
    const app = args[0];
    if (APP_NAMES[app]) {
      openWindow(app);
      return [`<span class="t-out">→ Opened ${APP_NAMES[app]}</span>`];
    }
    return [`<span class="t-err">open: no such app '${app || ''}'. Try: ${Object.keys(APP_NAMES).join(', ')}</span>`];
  },
  echo: (args) => [`<span class="t-out">${args.join(' ')}</span>`],
  man: (args) => {
    const cmd = args[0];
    const cmds = COMMANDS(openWindow, triggerNotif);
    if (cmd && cmds[cmd]) return [`<span class="t-out">${cmd}: ${APP_NAMES[cmd] ? 'opens the ' + APP_NAMES[cmd] + ' app' : 'a built-in terminal command'}</span>`];
    return [`<span class="t-err">No manual entry for '${cmd || ''}'</span>`];
  },
  neofetch: () => [
    '<span class="t-hi"> ███████╗██╗   ██╗██████╗  ██████╗      ██████╗ ███████╗</span>',
    '<span class="t-hi"> ██╔════╝██║   ██║██╔══██╗██╔═══██╗    ██╔═══██╗██╔════╝</span>',
    '<span class="t-hi"> ███████╗██║   ██║██║  ██║██║   ██║    ██║   ██║███████╗</span>',
    '<span class="t-hi"> ╚════██║██║   ██║██║  ██║██║   ██║    ██║   ██║╚════██║</span>',
    '<span class="t-hi"> ███████║╚██████╔╝██████╔╝╚██████╔╝    ╚██████╔╝███████║</span>',
    '<span class="t-hi"> ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝      ╚═════╝ ╚══════╝</span>',
    `<span class="t-out">  OS:</span>          sudoOS v1.0.0`,
    `<span class="t-out">  Host:</span>        Portfolio · Browser`,
    `<span class="t-out">  Resolution:</span>  ${window.innerWidth}×${window.innerHeight}`,
    `<span class="t-out">  CPU:</span>          Creative Engine™`,
    `<span class="t-out">  RAM:</span>          ∞ GB Ideas`,
    `<span class="t-out">  Uptime:</span>       Always shipping`,
  ],
});

export default function TerminalApp({ openWindow, triggerNotif }) {
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const cmdHistoryRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const termPrint = useCallback((html) => {
    if (!outputRef.current) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    outputRef.current.appendChild(line);
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, []);

  const termRun = useCallback((raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    termPrint(
      `<span class="t-prompt">madhav</span><span style="color:#ffffff">@</span>` +
      `<span class="t-path">sudoOS</span><span style="color:#ffffff">:~$</span> ` +
      `<span class="t-cmd">${raw}</span>`
    );

    const cmds = COMMANDS(openWindow, triggerNotif);
    if (cmd && cmds[cmd]) {
      cmds[cmd](args, outputRef).forEach(line => termPrint(line));
    } else if (cmd) {
      termPrint(`<span class="t-err">${cmd}: command not found. Type 'help' for available commands.</span>`);
    }
    termPrint('&nbsp;');
  }, [openWindow, triggerNotif, termPrint]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const raw = inputRef.current.value.trim();
      if (raw) cmdHistoryRef.current.unshift(raw);
      historyIndexRef.current = -1;
      termRun(raw);
      inputRef.current.value = '';
    } else if (e.key === 'ArrowUp') {
      historyIndexRef.current = Math.min(historyIndexRef.current + 1, cmdHistoryRef.current.length - 1);
      inputRef.current.value = cmdHistoryRef.current[historyIndexRef.current] || '';
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      historyIndexRef.current = Math.max(historyIndexRef.current - 1, -1);
      inputRef.current.value = historyIndexRef.current >= 0 ? cmdHistoryRef.current[historyIndexRef.current] : '';
      e.preventDefault();
    }
  }, [termRun]);

  const handleWindowClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div onClick={handleWindowClick}>
      <div className="terminal-body" id="terminal-output" ref={outputRef} style={{ height: '290px' }}>
        <div className="terminal-line"><span className="t-hi">sudoOS Terminal v1.0 — type 'help' for commands</span></div>
        <div className="terminal-line">&nbsp;</div>
      </div>
      <div className="terminal-body" style={{ height: 'auto', padding: '7px 20px 14px', borderTop: '1px solid #0d0d0d' }}>
        <div className="terminal-input-row">
          <span className="t-prompt">madhav</span>
          <span style={{ color: '#ffffff' }}>@</span>
          <span className="t-path">sudoOS</span>
          <span style={{ color: '#ffffff' }}>:~$&nbsp;</span>
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            autoComplete="off"
            spellCheck="false"
            placeholder="type a command…"
            onInput={() => playOSSound('type')}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
