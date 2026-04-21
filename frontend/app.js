const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api/device`;
const STATUS_URL = `${BASE_URL}/api/status`;

const devices = [
    { id: "bulb", name: "Smart Bulb" },
    { id: "plug", name: "Smart Plug" },
    { id: "fan", name: "Ceiling Fan" }
];

// Reference to active countdowns
const activeCountdowns = {};

function showNotification(message, type = 'success') {
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.innerText = message;
    document.body.appendChild(note);
    setTimeout(() => note.classList.add('show'), 100);
    setTimeout(() => {
        note.classList.remove('show');
        setTimeout(() => document.body.removeChild(note), 500);
    }, 3000);
}

async function updateConnectionStatus() {
    try {
        const response = await fetch(STATUS_URL);
        const data = await response.json();
        const statusEl = document.querySelector('.connection-status');
        
        if (data.mqtt === 'connected') {
            statusEl.className = 'connection-status connected';
            statusEl.innerHTML = '<div class="status-dot"></div> MQTT Online';
        } else {
            statusEl.className = 'connection-status disconnected';
            statusEl.innerHTML = '<div class="status-dot"></div> MQTT Offline';
        }
    } catch (e) {
        const statusEl = document.querySelector('.connection-status');
        statusEl.className = 'connection-status disconnected';
        statusEl.innerHTML = '<div class="status-dot"></div> Backend Down';
    }
}

// Initial status check and periodic polling
updateConnectionStatus();
setInterval(updateConnectionStatus, 5000);

function startLocalCountdown(device, seconds) {
    const display = document.getElementById(`countdown-${device}`);
    if (!display) return;

    // Clear existing interval if any
    if (activeCountdowns[device]) clearInterval(activeCountdowns[device]);

    display.classList.add('active');
    let remaining = seconds;

    const updateUI = () => {
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        display.innerText = `Auto-OFF in: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    updateUI();

    activeCountdowns[device] = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(activeCountdowns[device]);
            display.classList.remove('active');
            delete activeCountdowns[device];
        } else {
            updateUI();
        }
    }, 1000);
}

async function sendAction(device, state, duration = null) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device, state, duration })
        });

        const data = await response.json();

        if (response.ok) {
            const msg = duration 
                ? `${device.toUpperCase()} scheduled for ${Math.floor(duration/60)}m`
                : `${device.toUpperCase()} turned ${state}`;
            showNotification(msg);
            
            if (duration && state === 'ON') {
                startLocalCountdown(device, duration);
            } else if (state === 'OFF' || (state === 'ON' && !duration)) {
                // If turned OFF manually, clear countdown
                if (activeCountdowns[device]) {
                    clearInterval(activeCountdowns[device]);
                    const display = document.getElementById(`countdown-${device}`);
                    if (display) display.classList.remove('active');
                    delete activeCountdowns[device];
                }
            }
        } else {
            showNotification(data.error || "Action failed", "error");
        }
    } catch (error) {
        showNotification("Backend unreachable", "error");
    }
}

function handleTimer(device) {
    const hInput = document.getElementById(`timer-hour-${device}`);
    const mInput = document.getElementById(`timer-min-${device}`);

    const h = parseInt(hInput.value) || 0;
    const m = parseInt(mInput.value) || 0;

    if (h < 0 || m < 0) {
        showNotification("Time cannot be negative!", "error");
        return;
    }

    const totalSeconds = (h * 3600) + (m * 60);

    if (totalSeconds <= 0) {
        return showNotification("Set a valid time", "error");
    }

    sendAction(device, "ON", totalSeconds);

    hInput.value = '';
    mInput.value = '';
}

// Render UI
const grid = document.getElementById("devices");
grid.innerHTML = devices.map(d => `
    <div class="device-card">
        <span class="card-title">${d.name}</span>
        <div class="control-buttons">
            <button class="btn-modern btn-success-modern" onclick="sendAction('${d.id}','ON')">ON</button>
            <button class="btn-modern btn-danger-modern" onclick="sendAction('${d.id}','OFF')">OFF</button>
        </div>
        <div id="countdown-${d.id}" class="countdown-display"></div>
        <div class="timer-container">
            <div class="timer-inputs">
                <input type="number" min="0" class="timer-input" id="timer-hour-${d.id}" placeholder="HH">
                <input type="number" min="0" max="59" class="timer-input" id="timer-min-${d.id}" placeholder="MM">
            </div>
            <button class="btn-modern btn-schedule" onclick="handleTimer('${d.id}')">Set Schedule</button>
        </div>
    </div>
`).join('');