/* ── reset ── */
*, *::before, *::after {
  margin: 0; padding: 0; box-sizing: border-box;
}

:root {
  --red:    #cc0000;
  --red2:   #880000;
  --bg:     #0d0d0d;
  --bg2:    #111111;
  --bg3:    #0a0000;
  --border: #1a0000;
  --text:   #c8c8c8;
  --dim:    #333333;
  --font:   'Courier New', Courier, monospace;
}

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── HEADER ── */
#hdr {
  width: 100%;
  background: #0a0000;
  border-bottom: 1px solid var(--border);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo span {
  font-size: 1.1rem;
  letter-spacing: 6px;
  color: var(--red);
  text-transform: uppercase;
  font-weight: bold;
}

.pill {
  font-size: .65rem;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--dim);
  color: var(--dim);
  letter-spacing: 2px;
  transition: all .3s;
}
.pill.ready   { border-color: #4caf50; color: #4caf50; }
.pill.loading { border-color: #ff9800; color: #ff9800; animation: pulse 1s infinite; }
.pill.error   { border-color: var(--red); color: var(--red); }
.pill.running { border-color: var(--red); color: var(--red); }

@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ── MAIN ── */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 40px;
  gap: 12px;
}

/* ── CANVAS ── */
#wrap {
  position: relative;
  width: 640px;
  max-width: 100vw;
  background: #000;
  border: 1px solid var(--border);
  box-shadow: 0 0 60px #cc000022;
}

#c {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
  image-rendering: pixelated;
}

/* ── OVERLAY ── */
#ov {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.93);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 10;
  padding: 20px;
  transition: opacity .4s;
}

#ov.gone { opacity: 0; pointer-events: none; }

#ov h1 {
  font-size: 3rem;
  letter-spacing: 10px;
  color: var(--red);
  text-shadow: 0 0 40px #cc000066;
  text-transform: uppercase;
}

#ov .sub {
  font-size: .68rem;
  color: var(--dim);
  letter-spacing: 3px;
  margin-top: -6px;
}

/* drop zone */
.dropzone {
  width: 100%;
  max-width: 360px;
  border: 1px dashed var(--red2);
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: border-color .2s;
}

.dropzone.over { border-color: var(--red); background: #1a00001a; }

#drop-lbl { font-size: .8rem; color: var(--dim); line-height: 1.6; }

.file-btn {
  padding: 6px 20px;
  border: 1px solid var(--red2);
  color: var(--red);
  font-family: var(--font);
  font-size: .75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
}
.file-btn:hover { background: var(--red); color: #000; }
.file-btn input { display: none; }

.hint {
  font-size: .62rem;
  color: #2a2a2a;
  line-height: 1.6;
}
.hint a { color: #444; text-decoration: none; }
.hint a:hover { color: var(--red); }

/* progress bar */
#bar-wrap {
  width: 300px;
  height: 3px;
  background: #1a0000;
  display: none;
}
#bar-wrap.on { display: block; }
#bar {
  height: 100%;
  width: 0%;
  background: var(--red);
  transition: width .25s;
}
#bar-lbl {
  font-size: .62rem;
  color: var(--dim);
  letter-spacing: 1px;
  min-height: 14px;
}

/* launch btn */
#launch {
  padding: 10px 40px;
  background: transparent;
  border: 1px solid var(--red);
  color: var(--red);
  font-family: var(--font);
  font-size: .95rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
}
#launch:hover:not(:disabled) { background: var(--red); color: #000; }
#launch:disabled { opacity: .25; cursor: not-allowed; }

.hint2 { font-size: .6rem; color: #1f1f1f; letter-spacing: 1px; }

/* ── KEY MAP ── */
#keymap {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  width: 640px;
  max-width: 100vw;
  background: var(--border);
  border: 1px solid var(--border);
}

.km {
  background: var(--bg);
  padding: 7px 10px;
  font-size: .62rem;
  color: var(--dim);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.km span { color: var(--red); font-size: .7rem; }

/* ── CONTROL BAR ── */
#ctrlbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  width: 640px;
  max-width: 100vw;
}

.cb {
  padding: 6px 14px;
  background: var(--bg2);
  border: 1px solid #1e1e1e;
  color: var(--dim);
  font-family: var(--font);
  font-size: .68rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
}
.cb:hover:not(:disabled) { border-color: var(--red); color: var(--red); }
.cb:disabled { opacity: .2; pointer-events: none; }

/* ── CONSOLE ── */
#con-wrap {
  width: 640px;
  max-width: 100vw;
  background: #0a0a0a;
  border: 1px solid #1a0000;
}

#con-hdr {
  padding: 5px 12px;
  background: #0d0000;
  border-bottom: 1px solid #1a0000;
  font-size: .62rem;
  color: #2a0000;
  letter-spacing: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#con-hdr button {
  background: none; border: none;
  color: #2a0000; cursor: pointer;
  font-family: var(--font); font-size: .6rem;
  letter-spacing: 1px;
}
#con-hdr button:hover { color: var(--red); }

#con {
  padding: 8px 12px;
  height: 120px;
  overflow-y: auto;
  font-size: .68rem;
  line-height: 1.7;
}

.ln { display: block; }
.ln.ok { color: #4caf50; }
.ln.w  { color: #ff9800; }
.ln.e  { color: #f44336; }
.ln.s  { color: var(--red); }
.ln.i  { color: #445566; }

/* ── INFO STRIP ── */
#infostrip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  width: 640px;
  max-width: 100vw;
  background: #150000;
  border: 1px solid var(--border);
}

.ic { background: var(--bg); padding: 10px 14px; }
.il { font-size: .58rem; color: #2a2a2a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
.iv { font-size: .8rem; color: var(--text); }
.iv.ok { color: #4caf50; }
.iv.w  { color: #ff9800; }
.iv.e  { color: #f44336; }

/* ── FOOTER ── */
footer {
  text-align: center;
  font-size: .6rem;
  color: #1a1a1a;
  padding: 20px;
  letter-spacing: 2px;
}
footer a { color: #2a2a2a; text-decoration: none; }
footer a:hover { color: var(--red); }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #0a0000; }
::-webkit-scrollbar-thumb { background: #1a0000; }

/* ── SCREENSHOT FLASH ── */
@keyframes flash {
  0%   { outline: 3px solid #fff; }
  100% { outline: 3px solid transparent; }
}
#c.flash { animation: flash .2s ease-out; }

/* ── MOBILE ── */
@media (max-width: 660px) {
  #keymap  { grid-template-columns: repeat(3,1fr); }
  #infostrip { grid-template-columns: repeat(2,1fr); }
  .logo span { font-size: .85rem; letter-spacing: 3px; }
}
