/* Simple, independent completion functions. Edit each one as needed.
   Called once per letter per game. Images remain visible until Replay.
   Native alerts deliberately pause the game until OK is tapped.
   Remove the alert line later if uninterrupted play is preferred. */
function onS1Complete() {
    document.getElementById('s1Image').style.display = 'block';
    window.alert('Letter S1 is done.');
}

function onO1Complete() {
    document.getElementById('o1Image').style.display = 'block';
    window.alert('Letter O1 is done.');
}

function onS2Complete() {
    document.getElementById('s2Image').style.display = 'block';
    window.alert('Letter S2 is done.');
}
