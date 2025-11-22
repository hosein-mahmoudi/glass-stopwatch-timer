
// --- Panel Switch ---
const showStopwatchBtn = document.getElementById('showStopwatch');
const showTimerBtn = document.getElementById('showTimer');
const stopwatchPanel = document.getElementById('stopwatchPanel');
const timerPanel = document.getElementById('timerPanel');

// --- Stopwatch ---
const swDisplay = document.getElementById('swDisplay');
const swStart = document.getElementById('swStart');
const swPause = document.getElementById('swPause');
const swReset = document.getElementById('swReset');
const swLap = document.getElementById('swLap');
const lapsList = document.getElementById('lapsList');


showStopwatchBtn.onclick = () => {
    stopwatchPanel.classList.replace('hidden', 'visible');
    timerPanel.classList.replace('visible', 'hidden');
    showStopwatchBtn.classList.add('active');
    showTimerBtn.classList.remove('active');
};
showTimerBtn.onclick = () => {
    timerPanel.classList.replace('hidden', 'visible');
    stopwatchPanel.classList.replace('visible', 'hidden');
    showTimerBtn.classList.add('active');
    showStopwatchBtn.classList.remove('active');
};


let counter = 0, countersecond = 0, countermin = 0;
let timerId = null, swRunning = false, lapCount = 0;

swReset.onclick = () => {
    clearInterval(timerId);
    swRunning = false;
    swDisplay.textContent = "00:00.00";
    timerId = null;
    counter = countersecond = countermin = lapCount = 0;
    swPause.classList.add('d-none');
    swStart.classList.remove('d-none');
    document.getElementById("lapsList").innerHTML = "";
    
}

swStart.onclick = () => {
    if (!swRunning) {
        swRunning = true;
        swStart.classList.add('d-none');
        swPause.classList.remove('d-none');

        timerId = setInterval(() => {
            counter++;
            if (counter === 100) {
                counter = 0;
                countersecond++;
                if (countersecond === 60) {
                    countersecond = 0;
                    countermin++;
                }
            }

            swDisplay.textContent =
                `${String(countermin).padStart(2, '0')}:${String(countersecond).padStart(2, '0')}.${String(counter).padStart(2, '0')}`;
        }, 10);
    }
}
swPause.onclick = () => {
    if (swRunning) {
        swRunning = false;
        swPause.classList.add('d-none');
        swStart.classList.remove('d-none');
        clearInterval(timerId);

    }
};

swLap.onclick = () => {
    const laps = document.getElementById('lapsList');
    lapCount++;
    const newLap = document.createElement("div");
    newLap.className = 'list-group-item d-flex justify-content-between';
    newLap.innerHTML = `<div>Lap ${lapCount}</div><div>${swDisplay.textContent}</div>`;
    laps.insertBefore(newLap, laps.firstChild);

}


// --- Timer ---
const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerPause = document.getElementById('timerPause');
const timerReset = document.getElementById('timerReset');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const setTime = document.getElementById('setTime');
let total = 60000, remain = total, running = false, target = 0, anim = null;

setTime.addEventListener('click', function () {
    const m = parseInt(minutes.value || 0);
    const s = parseInt(seconds.value || 0);
    total = ((m * 60) + s) * 1000;
    remain = total;
    updateDisplay();
})
function updateDisplay() {
    timerDisplay.textContent = convertTimer(remain)
}

function convertTimer(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms % 3600000 / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

}
function startTimer() {
    if (remain <= 0) return;
    if (running) return;
    running = true;

    target = Date.now() + remain;
    timerStart.classList.add('d-none');
    timerPause.classList.remove('d-none');
    tick()
}


function tick() {
    remain = Math.max(0, target - Date.now())
    updateDisplay();
    if (remain <= 0) {
        running = false;
        timerStart.classList.remove('d-none');
        timerPause.classList.add('d-none');
        alert('⏰ Time is up!');
        return;
    }
    anim = requestAnimationFrame(tick);

}

function pauseTimer() {
    running = false;
    cancelAnimationFrame(anim);
    remain = Math.max(0, target - Date.now());
    timerPause.classList.add('d-none');
    timerStart.classList.remove('d-none');

}

function resetTimer() {
    running = false;
    cancelAnimationFrame(anim);
    remain = total;
    updateDisplay();
    timerPause.classList.add('d-none');
    timerStart.classList.remove('d-none');

}


timerStart.onclick = startTimer;
timerPause.onclick = pauseTimer;
timerReset.onclick = resetTimer;
updateDisplay();