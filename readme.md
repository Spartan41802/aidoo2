# DOOM — Browser

Pure browser DOOM. No install. No build. No server needed.  
Drop a WAD, hit launch, rip and tear.

## Live Demo

Deploy to GitHub Pages — works instantly.

## Usage

1. Open `index.html` in Chrome/Edge/Firefox
2. Drop your `doom1.wad` into the drop zone  
   *(shareware doom1.wad is free & legal — link in the UI)*
3. Hit **▶ LAUNCH**
4. Click canvas to lock pointer
5. Rip and tear

## Controls

| Key | Action |
|---|---|
| ↑ ↓ | Move |
| ← → | Turn |
| CTRL | Fire |
| SPACE | Use/Open |
| SHIFT | Run |
| ALT | Strafe |
| A D | Strafe left/right |
| 1–7 | Weapons |
| TAB | Automap |
| ESC | Menu |
| P | Pause |
| F5 | Detail |

Gamepad supported — plug in and go.

## GitHub Pages Deploy

```
Settings → Pages → Source: main branch / root → Save
```

Done. Your doom runs at `https://yourname.github.io/repo`

## Engine Sources

Tries in order until one works:

1. [UstymUkhman/DOOM](https://github.com/UstymUkhman/DOOM) — Emscripten WASM
2. [diekmann/doom](https://github.com/diekmann/diekmann.github.io) — Pure JS
3. [lazarv/wasm-doom](https://github.com/lazarv/wasm-doom) — Emscripten WASM

## Files

```
index.html   — main UI shell
style.css    — all styles
ui.js        — console / state / DOM helpers
wad.js       — WAD load, validate, drag-drop, fetch
input.js     — keyboard, mouse, gamepad → doom keys
audio.js     — WebAudio context, mute, resume
loader.js    — engine boot, controls, fallback chain
README.md    — this file
```

## WAD Note

DOOM1.WAD (shareware Episode 1) is free and legal to use.  
Full game WADs (doom2.wad etc.) require owning the game.  
Buy on [Steam](https://store.steampowered.com/app/2280/) or [GOG](https://www.gog.com/game/doom_doom_ii).

## License

Engine ports are GPLv2. DOOM © 1993 id Software.
