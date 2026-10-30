# S.O.S tracing game — smooth tracing update

Extract the ZIP and open `index.html` in a desktop browser. Keep all files and the assets folder together. For iPad/Android, open the hosted folder URL in Safari/Chrome or your CLM webview, not a Files/ZIP preview.

## What changed
- No narrow tracing corridor and no speed cutoff that disables tracing.
- Lift and resume anywhere on the current letter.
- Move outside and back into the current letter without lifting: tracing resumes automatically.
- Swept-line hit detection catches dots passed between fast touch events.
- Dots may be joined in any order within the active letter; S1, O1, S2 still complete in that order. All distinct dots must be reached. Returning to dot 1 is no longer required.
- Already visited dots are tinted. A red ring points to the first remaining dot, but it does not restrict where you can trace.
- The permanent drawing mask is no longer modified during rendering.
- Input ownership is cleared before each completion alert, preventing alerts from leaving touch input stuck.

The stage and canvas remain 1080 × 810, with proportional screen scaling. The original red/white artwork is retained; there is no graphic hand.

## Simple per-letter completion functions
Edit `completion.js`. Each function is called once per letter per round:

    function onS1Complete() {
        document.getElementById('s1Image').style.display = 'block';
        window.alert('Letter S1 is done.');
    }

The other functions are `onO1Complete()` and `onS2Complete()` and work the same way.

The included PNGs are:
- `assets/s1.png` — displayed when S1 is complete.
- `assets/o1.png` — displayed when O1 is complete.
- `assets/s2.png` — displayed when S2 is complete.

These are copies of the original completed letter artwork. They overlay the matching letters, remain visible and do not intercept touches. Replace them with your own PNGs if needed. Position and size are set in `style.css`. Replay hides all three and resets tracing.

Native alerts intentionally pause interaction. Tap OK, then trace the next letter. Remove the `window.alert(...)` lines if you later want no pauses at all. Images still display.

## Editable code
- `index.html`: canvas, images, optional video and script references.
- `style.css`: stage sizing, image positioning and appearance.
- `game.js`: plain ES5 tracing code and final completion function.
- `completion.js`: three simple per-letter completion functions.
- `assets/`: artwork, including s1.png, o1.png and s2.png.

`HIT_RADIUS` near the top of game.js controls dot tolerance (30 reference pixels). Dot coordinates use the video's original 1024 × 768 coordinates, scaled to the 1080 × 810 stage automatically.

## Final completion and future video
After the S2 alert is dismissed, `finishGame()` displays the STEP DOWN ON SALT image with:

    document.getElementById('completionImage').style.display = 'block';

To add a video, place an MP4 in assets and set `VIDEO_SOURCE` in game.js to its relative path, e.g. `assets/completion.mp4`. The same function displays it. `VIDEO_AUTOPLAY` defaults to false. Native video controls allow manual playback; mobile browsers may require a tap for playback with sound. Replay stops and unloads the video.

## Validation and compatibility
Automated simulated-event regression checks passed for pointer, legacy touch and mouse input at 1080 × 810 and 390 × 844. Checks cover leaving/returning without lifting, fast strokes, lifting and resuming elsewhere, letter order, each alert/image, final completion and a full second round after replay. JavaScript syntax checks passed.

These are logic checks, not real-device certification. Test on the actual iPads, Android devices and CLM webviews before delivery. HTML5 Canvas and JavaScript are required. Original artwork is extracted from the 1024 × 768 reference video, so its source detail is unchanged.
