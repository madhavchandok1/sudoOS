import { useState, useEffect, useRef, useCallback } from 'react';
import { NOTE_STORAGE_KEY } from '../../utils/constants';

export default function NotepadApp({ triggerNotif }) {
  const [content, setContent] = useState(() => localStorage.getItem(NOTE_STORAGE_KEY) || '');
  const [title, setTitle] = useState('Untitled — Notepad');
  const [wordWrap, setWordWrap] = useState(true);
  const [status, setStatus] = useState('0 chars');
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);

  const syncStatus = useCallback((text) => {
    const chars = text.length;
    const lines = text.split('\n').length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setStatus(`${chars} chars · ${lines} lines · ${words} words`);
  }, []);

  useEffect(() => {
    syncStatus(content);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setContent(val);
    syncStatus(val);
    setTitle('*Untitled — Notepad');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => localStorage.setItem(NOTE_STORAGE_KEY, val), 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const newVal = ta.value.substring(0, start) + '  ' + ta.value.substring(start);
      setContent(newVal);
      syncStatus(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const notepadNew = () => {
    if (content && !window.confirm('Discard current content?')) return;
    setContent('');
    localStorage.removeItem(NOTE_STORAGE_KEY);
    setTitle('Untitled — Notepad');
    syncStatus('');
  };

  const notepadSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'note.txt';
    a.click();
    triggerNotif('<i class="fa-solid fa-floppy-disk"></i>', 'Saved', 'note.txt downloaded to your computer.');
  };

  const notepadLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.html,.css,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const val = ev.target.result;
        setContent(val);
        syncStatus(val);
        setTitle(`${file.name} — Notepad`);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const notepadCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => triggerNotif('<i class="fa-solid fa-copy"></i>', 'Copied!', 'All text copied to clipboard.'));
  };

  const notepadWordCount = () => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const lines = content.split('\n').length;
    triggerNotif('<i class="fa-solid fa-chart-column"></i>', 'Document Stats', `${content.length} characters · ${words} words · ${lines} lines`);
  };

  const notepadWrap = () => {
    const newWrap = !wordWrap;
    setWordWrap(newWrap);
    triggerNotif('<i class="fa-solid fa-arrow-turn-down"></i>', 'Word Wrap', newWrap ? 'Word wrap enabled' : 'Word wrap disabled');
  };

  return (
    <div className="window-body" style={{ display: 'flex', flexDirection: 'column' }} onClick={() => textareaRef.current?.focus()}>
      <div className="notepad-toolbar">
        <button onClick={notepadNew}><i className="fa-solid fa-file"></i> New</button>
        <button onClick={notepadSave}><i className="fa-solid fa-floppy-disk"></i> Save</button>
        <button onClick={notepadLoad}><i className="fa-solid fa-folder-open"></i> Load</button>
        <button onClick={notepadCopy}><i className="fa-solid fa-copy"></i> Copy All</button>
        <button onClick={notepadWordCount}><i className="fa-solid fa-chart-column"></i> Stats</button>
        <button onClick={notepadWrap}><i className="fa-solid fa-arrow-turn-down"></i> Wrap</button>
        <span className="notepad-status" id="notepad-status">{status}</span>
      </div>
      <textarea
        ref={textareaRef}
        id="notepad-area"
        spellCheck="true"
        placeholder={"Start typing…\n\n💡 Auto-saves as you type. Tab for indentation."}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowX: wordWrap ? 'hidden' : 'auto',
        }}
      />
    </div>
  );
}
