/* audio.js — WebAudio context, mute, resume on interaction */

const Audio = (() => {

  let ctx   = null;
  let muted = false;

  function ensure() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      UI.log('AudioContext created (state: ' + ctx.state + ')', 'ok');
    } catch(e) {
      UI.log('AudioContext failed: ' + e.message, 'w');
    }
    return ctx;
  }

  /* browsers suspend audio until user gesture */
  function resume() {
    const c = ensure();
    if (c && c.state === 'suspended') {
      c.resume().then(() => UI.log('Audio resumed', 'ok'));
    }
  }

  function mute() {
    muted = true;
    const c = ensure();
    if (c) c.suspend();
    UI.log('Audio muted', 'i');
  }

  function unmute() {
    muted = false;
    resume();
    UI.log('Audio unmuted', 'ok');
  }

  function toggle() {
    muted ? unmute() : mute();
    return muted;
  }

  function isMuted() { return muted; }
  function getCtx()  { return ctx;   }

  /* auto-resume on first interaction */
  ['click','keydown','touchstart'].forEach(ev => {
    window.addEventListener(ev, () => { if (!muted) resume(); }, { once: false });
  });

  return { ensure, resume, mute, unmute, toggle, isMuted, getCtx };

})();
