/* loader.js — engine detection, boot, control wiring */

(() => {

  /* ────────────────────────────────────────────────
     ENGINE SOURCES
     Priority order — tries each until one works.
     All are prebuilt WASM/JS doom ports, no build needed.
  ──────────────────────────────────────────────── */
  const ENGINES = [
    {
      name: 'doom-wasm (UstymUkhman)',
      /* jsdelivr CDN of compiled doom.js from UstymUkhman/DOOM */
      js: 'https://cdn.jsdelivr.net/gh/UstymUkhman/DOOM@latest/dist/doom.js',
      type: 'emscripten'
    },
    {
      name: 'js-doom (diekmann)',
      /* pure JS doom port — no wasm needed */
      js: 'https://cdn.jsdelivr.net/gh/diekmann/diekmann.github.io@master/doom/doom.js',
      type: 'jsdoom'
    },
    {
      name: 'doom-wasm (lazarv)',
      js: 'https://cdn.jsdelivr.net/gh/lazarv/wasm-doom@master/dist/doom.js',
      type: 'emscripten'
    }
  ];

  /* ── DOM refs ── */
  const canvas    = document.getElementById('c');
  const ov        = document.getElementById('ov');
  const launchBtn = document.getElementById('launch');
  const bar       = document.getElementById('bar');
  const barW      = document.getElementById('bar-wrap');
  const barL      = document.getElementById('bar-lbl');

  const btnFS     = document.getElementById('btn-fs');
  const btnPause  = document.getElementById('btn-pause');
  const btnMute   = document.getElementById('btn-mute');
  const btnSS     = document.getElementById('btn-ss');
  const btnCon    = document.getElementById('btn-con');

  /* ── capability checks ── */
  const hasWasm = typeof WebAssembly === 'object';
  const hasSAB  = typeof SharedArrayBuffer !== 'undefined';

  UI.setInfo('wasm', hasWasm ? '✓ OK' : '✗ No',   hasWasm ? 'ok' : 'e');
  UI.setInfo('sab',  hasSAB  ? '✓ OK' : '⚠ No SAB (threads off)', hasSAB ? 'ok' : 'w');

  UI.log('DOOM browser loader init', 's');
  UI.log('WebAssembly: '         + (hasWasm ? 'OK' : 'NOT SUPPORTED'), hasWasm ? 'ok' : 'e');
  UI.log('SharedArrayBuffer: '   + (hasSAB  ? 'OK' : 'missing'), hasSAB ? 'ok' : 'w');
  if (!hasSAB) UI.log('Tip: serve with COOP/COEP headers for threads', 'w');

  /* ── script loader helper ── */
  function loadScript(src) {
    return new Promise((res, rej) => {
      /* check if already loaded */
      if (document.querySelector('script[src="'+src+'"]')) { res(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload  = res;
      s.onerror = () => rej(new Error('Failed to load: ' + src));
      document.body.appendChild(s);
    });
  }

  /* ── progress animation ── */
  let progTimer = null;
  function startProgress(label) {
    let p = 0;
    barW.classList.add('on');
    clearInterval(progTimer);
    progTimer = setInterval(() => {
      p = Math.min(p + 1.5, 88);
      bar.style.width = p + '%';
      barL.textContent = label + ' ' + Math.round(p) + '%';
    }, 80);
  }

  function finishProgress(label) {
    clearInterval(progTimer);
    bar.style.width = '100%';
    barL.textContent = label || 'done';
  }

  /* ── enable controls ── */
  function enableControls() {
    [btnFS, btnPause, btnMute, btnSS].forEach(b => b.disabled = false);
  }

  /* ── Emscripten Module boot ── */
  function bootEmscripten(wadBytes) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Engine timeout (30s)'));
      }, 30000);

      window.Module = {
        canvas: canvas,

        print:    t => UI.log(t, 'i'),
        printErr: t => UI.log(t, 'w'),

        setStatus(t) {
          if (t) {
            UI.log('engine: ' + t, 'i');
          } else {
            /* empty string = done */
            clearTimeout(timeout);
            resolve(window.Module);
          }
        },

        monitorRunDependencies(n) {
          if (n === 0) {
            finishProgress('engine ready');
            clearTimeout(timeout);
            resolve(window.Module);
          }
        },

        preRun: [function() {
          if (wadBytes) {
            try {
              /* inject WAD into emscripten virtual FS */
              const name = WAD.getName() || 'doom1.wad';
              Module.FS.writeFile('/' + name, wadBytes);
              UI.log('WAD injected into virtual FS: ' + name, 'ok');
            } catch(e) {
              UI.log('FS write failed: ' + e.message, 'w');
            }
          }
        }],

        arguments: [
          '-iwad', WAD.getName() || 'doom1.wad',
          '-width', '640',
          '-height', '400'
        ],

        onRuntimeInitialized() {
          UI.log('Runtime initialized', 'ok');
        },

        /* suppress extra Emscripten UI elements */
        noInitialRun: false,
        noExitRuntime: true,
      };
    });
  }

  /* ── JS-DOOM boot (pure JS, no WASM) ── */
  function bootJSDoom(wadBytes) {
    return new Promise((resolve, reject) => {
      /* js-doom typically auto-starts after script load
         and looks for canvas#c and window.wadData */
      if (wadBytes) window.wadData = wadBytes;
      window.doomCanvas = canvas;
      /* resolve after short delay — js-doom self-inits */
      setTimeout(() => resolve({ type: 'jsdoom' }), 2000);
    });
  }

  /* ── try engines in order ── */
  async function tryEngines(wadBytes) {
    for (let i = 0; i < ENGINES.length; i++) {
      const eng = ENGINES[i];
      UI.log('Trying engine: ' + eng.name, 'i');
      UI.setPill('LOADING', 'loading');
      UI.setState('loading engine ' + (i+1));

      try {
        startProgress('loading ' + eng.name);
        await loadScript(eng.js);
        UI.log('Script loaded: ' + eng.name, 'ok');
        finishProgress('script loaded');

        let mod;
        if (eng.type === 'emscripten') {
          mod = await bootEmscripten(wadBytes);
        } else {
          mod = await bootJSDoom(wadBytes);
        }

        window._doomModule  = mod;
        window._doomRunning = true;
        window._doomEngine  = eng;

        UI.log('Engine running: ' + eng.name, 'ok');
        UI.setPill('RUNNING', 'running');
        UI.setState('running');
        return true;

      } catch(err) {
        UI.log('Engine failed (' + eng.name + '): ' + err.message, 'w');
        UI.log('Trying next engine...', 'i');
        /* clean up Module to avoid conflicts */
        delete window.Module;
      }
    }
    throw new Error('All engines failed');
  }

  /* ── LAUNCH ── */
  launchBtn.addEventListener('click', async () => {
    launchBtn.disabled = true;
    Audio.resume();

    const wadBytes = WAD.get();

    UI.log('── Launch sequence ──', 's');
    UI.log('WAD: ' + (WAD.getName() || 'none'), wadBytes ? 'ok' : 'w');

    if (!wadBytes) {
      UI.log('No WAD loaded — attempting to fetch shareware doom1.wad...', 'w');
      /* CORS-friendly proxies for shareware doom1.wad */
      const mirrors = [
        'https://cdn.jsdelivr.net/gh/nicowillis/doom-wad@main/doom1.wad',
        'https://raw.githubusercontent.com/Mr-Wiseguy/doom-wad/main/doom1.wad',
      ];
      let fetched = false;
      for (const url of mirrors) {
        try {
          await WAD.fetchWAD(url, 'doom1.wad (shareware)');
          if (WAD.get()) { fetched = true; break; }
        } catch(e) {
          UI.log('Mirror failed: ' + url, 'w');
        }
      }
      if (!fetched) {
        UI.log('Could not auto-fetch WAD. Drop doom1.wad manually.', 'e');
        launchBtn.disabled = false;
        return;
      }
    }

    try {
      await tryEngines(WAD.get());

      /* hide overlay */
      ov.classList.add('gone');
      canvas.focus();
      canvas.requestPointerLock();

      /* unlock controls */
      enableControls();

      /* wire canvas click back for pointer relock */
      canvas.addEventListener('click', () => {
        if (window._doomRunning) canvas.requestPointerLock();
      });

    } catch(err) {
      UI.log('FATAL: ' + err.message, 'e');
      UI.log('Check console (F12) for details', 'w');
      UI.setPill('ERROR', 'error');
      UI.setState('error');
      launchBtn.disabled  = false;
      launchBtn.textContent = 'RETRY';
    }
  });

  /* ── FULLSCREEN ── */
  btnFS.addEventListener('click', () => {
    const wrap = document.getElementById('wrap');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrap.requestFullscreen().catch(e => UI.log('Fullscreen: ' + e.message, 'w'));
    }
  });

  document.addEventListener('fullscreenchange', () => {
    btnFS.textContent = document.fullscreenElement ? '⛶ Exit Full' : '⛶ Fullscreen';
  });

  /* ── PAUSE ── */
  let paused = false;
  btnPause.addEventListener('click', () => {
    paused = !paused;
    btnPause.textContent = paused ? '▶ Resume' : '⏸ Pause';
    UI.log(paused ? 'Paused' : 'Resumed', 'i');
    /* Emscripten exposes these */
    if (window.Module) {
      try {
        paused
          ? Module.pauseMainLoop()
          : Module.resumeMainLoop();
      } catch(e) {}
    }
  });

  /* ── MUTE ── */
  btnMute.addEventListener('click', () => {
    const m = Audio.toggle();
    btnMute.textContent = m ? '🔊 Unmute' : '🔇 Mute';
  });

  /* ── SCREENSHOT ── */
  btnSS.addEventListener('click', () => {
    try {
      const link = document.createElement('a');
      link.download = 'doom-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      UI.flash();
      UI.log('Screenshot saved', 'ok');
    } catch(e) {
      UI.log('Screenshot failed (canvas tainted?): ' + e.message, 'w');
    }
  });

  /* ── CONSOLE TOGGLE ── */
  btnCon.addEventListener('click', () => UI.toggleCon());

  /* ── keyboard shortcut: P = pause ── */
  window.addEventListener('keydown', e => {
    if (e.code === 'KeyP' && window._doomRunning) {
      btnPause.click();
    }
  });

})();
