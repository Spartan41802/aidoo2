/* wad.js — WAD loading, validation, drag-drop, file picker */

const WAD = (() => {

  let wadData   = null; // Uint8Array
  let wadName   = '';
  const launchBtn = document.getElementById('launch');
  const dropzone  = document.getElementById('dropzone');

  /* ── WAD magic check: first 4 bytes must be IWAD or PWAD ── */
  function validate(buf) {
    const sig = String.fromCharCode(
      buf[0], buf[1], buf[2], buf[3]
    );
    return sig === 'IWAD' || sig === 'PWAD';
  }

  function process(arrayBuffer, name) {
    const u8 = new Uint8Array(arrayBuffer);
    if (!validate(u8)) {
      UI.log('Invalid WAD — bad magic bytes (not IWAD/PWAD)', 'e');
      return;
    }
    wadData = u8;
    wadName = name;
    UI.log('WAD loaded: ' + name +
           ' (' + (arrayBuffer.byteLength / 1024 / 1024).toFixed(2) + ' MB)', 'ok');
    UI.setWAD(name);
    UI.setInfo('wad', name, 'ok');
    launchBtn.disabled = false;
    document.getElementById('drop-lbl').textContent = '✓ ' + name;
    dropzone.style.borderColor = '#4caf50';
  }

  /* ── file reader ── */
  function readFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.wad')) {
      UI.log('Expected a .wad file', 'w');
      return;
    }
    UI.log('Reading: ' + file.name + '...');
    const r = new FileReader();
    r.onload = e => process(e.target.result, file.name);
    r.onerror = () => UI.log('File read error', 'e');
    r.readAsArrayBuffer(file);
  }

  /* ── drag-drop ── */
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('over');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('over');
  });
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('over');
    readFile(e.dataTransfer.files[0]);
  });

  /* also accept drop on full page */
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.name.toLowerCase().endsWith('.wad')) readFile(f);
  });

  /* ── file picker ── */
  document.getElementById('wad-pick')
    .addEventListener('change', function() {
      readFile(this.files[0]);
    });

  /* ── fetch WAD from URL (for auto-load shareware) ── */
  async function fetchWAD(url, label) {
    UI.log('Fetching WAD: ' + (label || url), 'i');
    UI.setBar(5, 'fetching WAD...');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const total = parseInt(res.headers.get('content-length') || '0', 10);
      const reader = res.body.getReader();
      let recv = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        recv += value.length;
        if (total) UI.setBar(Math.round(recv/total*60), 'WAD ' + Math.round(recv/total*100) + '%');
      }
      const out = new Uint8Array(recv);
      let pos = 0;
      for (const c of chunks) { out.set(c, pos); pos += c.length; }
      process(out.buffer, label || 'doom1.wad');
    } catch(err) {
      UI.log('WAD fetch failed: ' + err.message, 'w');
      UI.log('Please drop your WAD file manually', 'w');
    }
  }

  function get()     { return wadData; }
  function getName() { return wadName; }

  return { get, getName, fetchWAD };

})();
