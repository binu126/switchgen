const API_URL = "http://localhost:3000/api/device";

const devices = [
    { id: "bulb", name: "Smart Bulb" },
    { id: "plug", name: "Smart Plug" },
    { id: "fan", name: "Ceiling Fan" }
];

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

async function sendAction(device, state, duration = null) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device, state, duration })
        });

        if (response.ok) {
            const msg = duration 
                ? `${device.toUpperCase()} scheduled for ${Math.floor(duration/60)}m`
                : `${device.toUpperCase()} turned ${state}`;
            showNotification(msg);
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

    // 1. JS Validation: Block negative values
    if (h < 0 || m < 0) {
        showNotification("Time cannot be negative!", "error");
        return;
    }

    const totalSeconds = (h * 3600) + (m * 60);

    if (totalSeconds <= 0) {
        return showNotification("Set a valid time", "error");
    }

    sendAction(device, "ON", totalSeconds);

    // Optional: Reset inputs after setting
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
        <div class="timer-container">
            <div class="timer-inputs">
                <input type="number" min="0" class="timer-input" id="timer-hour-${d.id}" placeholder="HH">
                <input type="number" min="0" max="59" class="timer-input" id="timer-min-${d.id}" placeholder="MM">
            </div>
            <button class="btn-modern btn-schedule" onclick="handleTimer('${d.id}')">Set Schedule</button>
        </div>
    </div>
`).join('');