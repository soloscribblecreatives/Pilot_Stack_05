/* Plain ES5 JavaScript. No packages, build tools, network requests or frameworks. */
(function () {
    'use strict';

    // EDIT THESE SETTINGS. Coordinates below follow the 1024 × 768 reference.
    // The visible canvas itself is exactly 1080 × 810.
    var HIT_RADIUS = 30;       // Finger tolerance around the next numbered dot.
    var VIDEO_SOURCE = '';    // Example: 'assets/completion.mp4'. Empty = image only.
    var VIDEO_AUTOPLAY = false; // Mobile devices may require tapping Play for sound.
    var SCALE = 1080 / 1024;
    var letters = [
        { name: 'first S', file: 's-first', x: 132, y: 296, points: [[294,343],[210,319],[155,377],[195,432],[248,456],[175,447],[148,482],[217,514],[292,483],[285,416],[207,378],[267,383],[294,343]] },
        { name: 'O', file: 'o', x: 365, y: 296, points: [[479,318],[398,356],[378,418],[398,476],[479,516],[557,476],[577,418],[557,356],[479,318]] },
        { name: 'last S', file: 's-last', x: 632, y: 296, points: [[799,343],[715,319],[660,377],[700,432],[753,456],[680,447],[657,485],[722,514],[797,483],[790,416],[712,378],[772,383],[799,343]] }
    ];
    var game = document.getElementById('game');
    var canvas = document.getElementById('drawing');
    var ctx = canvas.getContext('2d');
    var status = document.getElementById('status');
    var prompt = document.getElementById('prompt');
    var active = 0, next = 0, drawing = false, last = null, ready = false;
    var inputId = null, lastTouch = 0, pending = false, notifying = false;
    var reveal = document.createElement('canvas');
    reveal.width = 1024; reveal.height = 768;
    var period1 = new Image(), period2 = new Image();
    var frame = window.requestAnimationFrame || function (callback) { return window.setTimeout(callback, 16); };

    // Fit the fixed-size stage without changing its proportions or touch coordinates.
    function fitStage() {
        var scale = Math.min(window.innerWidth / 1080, window.innerHeight / 810);
        game.style.transform = 'scale(' + scale + ')';
        game.style.webkitTransform = 'scale(' + scale + ')';
        game.style.left = (window.innerWidth - 1080 * scale) / 2 + 'px';
        game.style.top = (window.innerHeight - 810 * scale) / 2 + 'px';
    }
    window.addEventListener('resize', fitStage, false);
    window.addEventListener('orientationchange', fitStage, false);
    fitStage();

    // A separate mask reveals the original 3D artwork under the user's actual stroke.
    var i, loaded = 0;
    function assetLoaded() {
        loaded += 1;
        if (loaded === 5) { ready = true; render(); }
    }
    function assetFailed() { status.textContent = 'An image could not load. Keep the assets folder beside index.html and reload.'; prompt.textContent = 'Please reload — artwork could not load.'; }
    for (i = 0; i < letters.length; i += 1) {
        letters[i].image = new Image();
        letters[i].image.onload = assetLoaded;
        letters[i].image.onerror = assetFailed;
        letters[i].image.src = 'assets/' + letters[i].file + '.png';
        letters[i].mask = document.createElement('canvas');
        letters[i].mask.width = 1024; letters[i].mask.height = 768;
        letters[i].visited = [];
    }
    period1.onload = assetLoaded; period2.onload = assetLoaded;
    period1.onerror = assetFailed; period2.onerror = assetFailed;
    period1.src = 'assets/period-first.png'; period2.src = 'assets/period-second.png';

    function distance(a, b) { var x = a[0] - b[0], y = a[1] - b[1]; return Math.sqrt(x * x + y * y); }
    function segmentDistance(p, a, b) {
        var x = b[0] - a[0], y = b[1] - a[1];
        var length = x * x + y * y;
        var t = length ? ((p[0] - a[0]) * x + (p[1] - a[1]) * y) / length : 0;
        t = Math.max(0, Math.min(1, t));
        return distance(p, [a[0] + t * x, a[1] + t * y]);
    }
    function queueRender() {
        if (pending) { return; }
        pending = true;
        frame(function () { pending = false; render(); });
    }
    function render() {
        if (!ready) { return; }
        ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        ctx.clearRect(0, 0, 1024, 768);
        var l, j, p, maskContext;
        for (l = 0; l < letters.length; l += 1) {
            var letter = letters[l];
            if (l < active) {
                ctx.drawImage(letter.image, letter.x, letter.y);
            } else {
                // Thin guide and numbered white dots retain the reference's layout.
                if (l === active && next > 0) {
                    ctx.strokeStyle = '#5b101e'; ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    p = letter.points[0]; ctx.moveTo(p[0], p[1]);
                    for (j = 1; j < letter.points.length - 1; j += 1) {
                        p = letter.points[j];
                        var following = letter.points[j + 1];
                        ctx.quadraticCurveTo(p[0], p[1], (p[0] + following[0]) / 2, (p[1] + following[1]) / 2);
                    }
                    p = letter.points[letter.points.length - 1];
                    ctx.lineTo(p[0], p[1]); ctx.stroke();
                }
                if (l === active) {
                    // Keep the permanent stroke mask separate from the artwork buffer.
                    // Rendering must never erase previously traced areas.
                    maskContext = reveal.getContext('2d');
                    maskContext.clearRect(0, 0, 1024, 768);
                    maskContext.globalCompositeOperation = 'source-over';
                    maskContext.drawImage(letter.mask, 0, 0);
                    maskContext.globalCompositeOperation = 'source-in';
                    maskContext.drawImage(letter.image, letter.x, letter.y);
                    maskContext.globalCompositeOperation = 'source-over';
                    ctx.drawImage(reveal, 0, 0);
                }
                for (j = 0; j < letter.points.length - 1; j += 1) {
                    p = letter.points[j];
                    ctx.beginPath(); ctx.arc(p[0], p[1], 8.5, 0, Math.PI * 2);
                    ctx.fillStyle = letter.visited[j] ? '#cfb0b5' : '#e8e9e7'; ctx.fill();
                    ctx.fillStyle = '#161616'; ctx.font = '12px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(j + 1, p[0], p[1] + 0.5);
                }
                if (l === active) {
                    p = letter.points[next];
                    ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, Math.PI * 2);
                    ctx.strokeStyle = '#b50c2e'; ctx.lineWidth = 1.5; ctx.stroke();
                }
            }
        }
        if (active > 0) { ctx.drawImage(period1, 305, 446); }
        if (active > 1) { ctx.drawImage(period2, 566, 446); }
    }
    function addStroke(a, b) {
        var mask = letters[active].mask.getContext('2d');
        mask.strokeStyle = '#fff'; mask.lineWidth = 64;
        mask.lineCap = 'round'; mask.lineJoin = 'round';
        mask.beginPath(); mask.moveTo(a[0], a[1]); mask.lineTo(b[0], b[1]); mask.stroke();
    }
    function position(event) {
        var rect = canvas.getBoundingClientRect();
        return [(event.clientX - rect.left) * 1024 / rect.width, (event.clientY - rect.top) * 768 / rect.height];
    }
    // Free tracing: no narrow corridor, speed cutoff, or exact resume position.
    // Dots can be collected in any order within the CURRENT letter.
    function insideLetter(point) {
        var letter = letters[active];
        return point[0] >= letter.x - 35 && point[0] <= letter.x + letter.image.width + 35 &&
            point[1] >= letter.y - 35 && point[1] <= letter.y + letter.image.height + 35;
    }
    function begin(point) {
        if (!ready || active >= 3 || notifying) { return; }
        drawing = true;
        last = null; // A finger lift must never draw a connecting jump on resuming.
        move(point);
    }
    function move(point) {
        if (!drawing || active >= 3 || notifying) { return; }
        if (!insideLetter(point)) { last = null; return; }
        var letter = letters[active];
        var previous = last || point;
        addStroke(previous, point);
        // Check the whole swept line, so fast gestures cannot skip dots between events.
        for (var n = 0; n < letter.points.length - 1; n += 1) {
            if (segmentDistance(letter.points[n], previous, point) <= HIT_RADIUS) {
                letter.visited[n] = true;
            }
        }
        last = point;
        next = 0;
        while (next < letter.points.length - 1 && letter.visited[next]) { next += 1; }
        if (next === letter.points.length - 1) {
            completeLetter();
        }
        queueRender();
    }
    function end() { drawing = false; last = null; inputId = null; }

    function completeLetter() {
        var completed = active;
        var pointer = inputId;
        end(); // Clear ownership BEFORE the alert; modal dialogs can swallow pointerup.
        if (pointer !== null && canvas.releasePointerCapture) {
            try { canvas.releasePointerCapture(pointer); } catch (ignore) { /* Already released. */ }
        }
        active += 1; next = 0; notifying = true;
        render();
        // Give the finished artwork a paint opportunity before the requested alert.
        window.setTimeout(function () {
            try {
                if (completed === 0) { onS1Complete(); }
                if (completed === 1) { onO1Complete(); }
                if (completed === 2) { onS2Complete(); }
            } finally {
                notifying = false;
                if (active === 3) { finishGame(); }
                else { status.textContent = 'Trace ' + letters[active].name + '. Join its remaining dots.'; }
            }
        }, 80);
    }

    // COMPLETION HOOK: the image is explicitly displayed with JS, as requested.
    function finishGame() {
        document.getElementById('completionImage').style.display = 'block';
        document.getElementById('thankYou').style.display = 'block';
        // Cover the two introductory lines while preserving the original header logos.
        document.getElementById('background').style.clip = 'rect(0px,1080px,90px,0px)';
        prompt.style.display = 'none';
        document.getElementById('restart').style.display = 'block';
        status.textContent = 'Completed. STEP DOWN ON SALT.';
        if (VIDEO_SOURCE) {
            var video = document.getElementById('completionVideo');
            video.src = VIDEO_SOURCE;
            video.style.display = 'block';
            if (VIDEO_AUTOPLAY) {
                var playback = video.play();
                if (playback && playback.catch) { playback.catch(function () { /* Native Play control remains available. */ }); }
            }
        }
    }
    function resetGame() {
        end(); active = 0; next = 0; last = null;
        for (var n = 0; n < letters.length; n += 1) {
            letters[n].mask.getContext('2d').clearRect(0, 0, 1024, 768);
            letters[n].visited = [];
        }
        document.getElementById('s1Image').style.display = 'none';
        document.getElementById('o1Image').style.display = 'none';
        document.getElementById('s2Image').style.display = 'none';
        document.getElementById('completionImage').style.display = 'none';
        document.getElementById('thankYou').style.display = 'none';
        document.getElementById('background').style.clip = 'auto';
        var video = document.getElementById('completionVideo');
        video.pause(); video.removeAttribute('src'); video.load(); video.style.display = 'none';
        document.getElementById('restart').style.display = 'none';
        prompt.style.display = 'block';
        status.textContent = 'Trace the first S. Join all its dots; lift and resume anywhere on the letter.';
        queueRender();
    }
    document.getElementById('restart').onclick = resetGame;

    // Pointer input for modern browsers; Touch + Mouse fallback for older iPads.
    if (window.PointerEvent) {
        canvas.addEventListener('pointerdown', function (e) {
            if (inputId !== null || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
            e.preventDefault(); inputId = e.pointerId;
            if (canvas.setPointerCapture) { canvas.setPointerCapture(e.pointerId); }
            begin(position(e));
        }, false);
        canvas.addEventListener('pointermove', function (e) {
            if (e.pointerId !== inputId) { return; }
            e.preventDefault();
            var events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            if (!events.length) { events = [e]; }
            for (var n = 0; n < events.length; n += 1) { move(position(events[n])); }
        }, false);
        window.addEventListener('pointerup', function (e) { if (e.pointerId === inputId) { end(); } }, false);
        window.addEventListener('pointercancel', function (e) { if (e.pointerId === inputId) { end(); } }, false);
        canvas.addEventListener('lostpointercapture', end, false);
    } else {
        // Detect event options to avoid breaking old Safari's boolean-only API.
        var touchOptions = false;
        try {
            var options = Object.defineProperty({}, 'passive', { get: function () { touchOptions = { passive: false }; } });
            window.addEventListener('sos-options-test', end, options);
            window.removeEventListener('sos-options-test', end, options);
        } catch (ignore) { /* Boolean listener argument is supported by older Safari. */ }
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault(); lastTouch = Date.now();
            if (inputId !== null) { return; }
            var touch = e.changedTouches[0]; inputId = touch.identifier; begin(position(touch));
        }, touchOptions);
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            for (var n = 0; n < e.changedTouches.length; n += 1) {
                if (e.changedTouches[n].identifier === inputId) { move(position(e.changedTouches[n])); }
            }
        }, touchOptions);
        function touchEnd(e) {
            for (var n = 0; n < e.changedTouches.length; n += 1) { if (e.changedTouches[n].identifier === inputId) { end(); } }
        }
        window.addEventListener('touchend', touchEnd, false);
        window.addEventListener('touchcancel', touchEnd, false);
        canvas.addEventListener('mousedown', function (e) { if (e.button === 0 && Date.now() - lastTouch > 800) { e.preventDefault(); begin(position(e)); } }, false);
        window.addEventListener('mousemove', function (e) { move(position(e)); }, false);
        window.addEventListener('mouseup', end, false);
    }
    window.addEventListener('blur', end, false);
    document.addEventListener('visibilitychange', function () { if (document.hidden) { end(); } }, false);
}());
