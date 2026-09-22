/* input.js — keyboard, mouse, pointer lock, gamepad */

const Input = (() => {

  /* ── doom key codes (matching chocolate-doom / doomgeneric) ── */
  const KEY = {
    RIGHTARROW: 0xae,
    LEFTARROW:  0xac,
    UPARROW:    0xad,
    DOWNARROW:  0xaf,
    STRAFE_L:   0xa0,
    STRAFE_R:   0xa1,
    FIRE:       0xa2,
    USE:        0xa3,
    RSHIFT:     0xb6,
    RCTRL:      0xb7,
    RALT:       0xb8,
    BACKSPACE:  0x7f,
    ESCAPE:     27,
    ENTER:      13,
    TAB:        9,
    F1:  0x80, F2:  0x81, F3:  0x82,
    F4:  0x83, F5:  0x84, F6:  0x85,
    F7:  0x86, F8:  0x87, F9:  0x88,
    F10: 0x89, F11: 0x8a, F12: 0x8b,
    PAUSE:      0xff,
    MINUS:      0x2d,
    EQUALS:     0x3d,
  };

  /* ── browser key → doom key ── */
  function mapKey(e) {
    switch(e.code) {
      case 'ArrowUp':    case 'KeyW': return KEY.UPARROW;
      case 'ArrowDown':  case 'KeyS': return KEY.DOWNARROW;
      case 'ArrowLeft':               return KEY.LEFTARROW;
      case 'ArrowRight':              return KEY.RIGHTARROW;
      case 'ControlLeft':
      case 'ControlRight':            return KEY.FIRE;
      case 'Space':                   return KEY.USE;
      case 'ShiftLeft':
      case 'ShiftRight':              return KEY.RSHIFT;
      case 'AltLeft':
      case 'AltRight':                return KEY.RALT;
      case 'KeyA':                    return KEY.STRAFE_L;
      case 'KeyD':                    return KEY.STRAFE_R;
      case 'Enter':                   return KEY.ENTER;
      case 'Escape':                  return KEY.ESCAPE;
      case 'Tab':                     return KEY.TAB;
      case 'Backspace':               return KEY.BACKSPACE;
      case 'Pause':                   return KEY.PAUSE;
      case 'F1':  return KEY.F1;  case 'F2':  return KEY.F2;
      case 'F3':  return KEY.F3;  case 'F4':  return KEY.F4;
      case 'F5':  return KEY.F5;  case 'F6':  return KEY.F6;
      case 'F7':  return KEY.F7;  case 'F8':  return KEY.F8;
      case 'F9':  return KEY.F9;  case 'F10': return KEY.F10;
      case 'F11': return KEY.F11; case 'F12': return KEY.F12;
      case 'Minus':    return KEY.MINUS;
      case 'Equal':    return KEY.EQUALS;
      default:
        /* number keys 1-7 for weapons */
        if (e.code.startsWith('Digit')) {
          const n = parseInt(e.code.replace('Digit',''));
          if (n >= 1 && n <= 7) return 0x30 + n;
        }
        /* letter keys */
        if (e.code.startsWith('Key')) {
          return e.code.replace('Key','').toLowerCase().charCodeAt(0);
        }
        return 0;
    }
  }

  /* ── mouse button → doom key ── */
  function mapMouse(btn) {
    switch(btn) {
      case 0: return KEY.FIRE;
      case 2: return KEY.USE;
      default: return 0;
    }
  }

  /* ── event queue ── */
  const queue = [];
  function push(key, pressed) {
    if (key) queue.push({ key, pressed });
  }
  function pop() { return queue.shift() || null; }
  function flush() { queue.length = 0; }

  /* ── keyboard listeners ── */
  const canvas = document.getElementById('c');

  window.addEventListener('keydown', e => {
    e.preventDefault();
    push(mapKey(e), true);
  });

  window.addEventListener('keyup', e => {
    e.preventDefault();
    push(mapKey(e), false);
  });

  /* ── mouse ── */
  let mouseX = 0;

  canvas.addEventListener('mousemove', e => {
    mouseX += e.movementX;
  });

  canvas.addEventListener('mousedown', e => {
    push(mapMouse(e.button), true);
  });

  canvas.addEventListener('mouseup', e => {
    push(mapMouse(e.button), false);
  });

  function getMouseDelta() {
    const d = mouseX;
    mouseX = 0;
    return d;
  }

  /* ── pointer lock ── */
  canvas.addEventListener('click', () => {
    if (window._doomRunning) canvas.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    UI.log(locked ? 'Pointer locked' : 'Pointer released', 'i');
  });

  /* ── gamepad support ── */
  let gpInterval = null;
  const GP_DEAD = 0.2;

  function startGamepad() {
    if (gpInterval) return;
    gpInterval = setInterval(() => {
      const pads = navigator.getGamepads();
      for (const gp of pads) {
        if (!gp) continue;
        /* axes — left stick */
        const lx = gp.axes[0], ly = gp.axes[1];
        if (Math.abs(ly) > GP_DEAD) push(ly < 0 ? KEY.UPARROW : KEY.DOWNARROW, true);
        if (Math.abs(lx) > GP_DEAD) push(lx < 0 ? KEY.LEFTARROW : KEY.RIGHTARROW, true);
        /* buttons */
        const map = {
          0: KEY.USE,    /* A */
          1: KEY.FIRE,   /* B */
          9: KEY.ESCAPE, /* start */
        };
        for (const [idx, dk] of Object.entries(map)) {
          if (gp.buttons[idx] && gp.buttons[idx].pressed) push(dk, true);
        }
      }
    }, 16);
    UI.log('Gamepad support active', 'ok');
  }

  window.addEventListener('gamepadconnected', e => {
    UI.log('Gamepad connected: ' + e.gamepad.id, 'ok');
    startGamepad();
  });

  window.addEventListener('gamepaddisconnected', e => {
    UI.log('Gamepad disconnected: ' + e.gamepad.id, 'w');
  });

  return { pop, flush, getMouseDelta, KEY };

})();
