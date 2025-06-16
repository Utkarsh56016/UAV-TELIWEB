// All initialization code is now inside DOMContentLoaded for safety

document.addEventListener('DOMContentLoaded', function() {
    // Theme switching logic
    const themeSelect = document.getElementById('theme-select');
    const themes = {
        default: 'theme-default',
        darkblue: 'theme-darkblue',
        cyber: 'theme-cyber',
        black: 'theme-black',
        hacker: 'theme-hacker',
        light: 'theme-light'
    };
    let codeRainAnimationId = null;
    let codeRainResizeTimeout = null;

    function debouncedResizeCodeRain() {
        const canvas = document.getElementById('code-rain-bg');
        if (!canvas) return;
        if (codeRainResizeTimeout) clearTimeout(codeRainResizeTimeout);
        codeRainResizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 150);
    }

    function startCodeRain() {
    const canvas = document.getElementById('code-rain-bg');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let lastDrawTime = performance.now();
    function draw(now) {
        if (!now) now = performance.now();
        if (now - lastDrawTime >= 42) {
            ctx.fillStyle = 'rgba(10, 15, 10, 0.22)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px monospace';
            ctx.fillStyle = '#35e87a';
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            lastDrawTime = now;
        }
        codeRainAnimationId = requestAnimationFrame(draw);
    }
    function debouncedResizeCodeRain() {
        if (codeRainResizeTimeout) clearTimeout(codeRainResizeTimeout);
        codeRainResizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 150);
    }
    window.addEventListener('resize', debouncedResizeCodeRain);
    draw();
}

function stopCodeRain() {
    if (codeRainAnimationId) cancelAnimationFrame(codeRainAnimationId);
    codeRainAnimationId = null;
    if (codeRainResizeTimeout) clearTimeout(codeRainResizeTimeout);
    codeRainResizeTimeout = null;
    const canvas = document.getElementById('code-rain-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    window.removeEventListener('resize', debouncedResizeCodeRain);
}

function applyTheme(themeKey) {
    const themeClass = themes[themeKey] || 'theme-default';
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themeClass);
    localStorage.setItem('uav-theme', themeKey);
    // Code rain effect
    const codeRainCanvas = document.getElementById('code-rain-bg');
    if (themeKey === 'hacker') {
        if (codeRainCanvas) codeRainCanvas.style.display = 'block';
        startCodeRain();
    } else {
        if (codeRainCanvas) codeRainCanvas.style.display = 'none';
        stopCodeRain();
    }
}
if (themeSelect) {
    themeSelect.addEventListener('change', e => {
        applyTheme(e.target.value);
    });
}
// On load, apply saved theme
const savedTheme = localStorage.getItem('uav-theme') || 'default';
if (themeSelect) themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Telemetry fetch
async function updateTelemetry() {
    try {
        const response = await fetch('http://localhost:8000/api/telemetry');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Helper: format value or fallback to dash
        function fmt(val, digits = null) {
            if (typeof val === 'number' && !isNaN(val)) {
                return digits !== null ? val.toFixed(digits) : String(val);
            }
            return '—';
        }
        // Helper: update textContent safely
        function updateIfChanged(id, value) {
            const el = document.getElementById(id);
            if (el && el.textContent !== String(value)) el.textContent = value;
        }
        // GPS
        updateIfChanged('lat', fmt(data.lat, 7));
        updateIfChanged('lon', fmt(data.lon, 7));
        // Altitude
        updateIfChanged('alt', fmt(data.alt, 2));
        // Velocity (vx, vy, vz)
        updateIfChanged('vx', fmt(data.vx, 2));
        updateIfChanged('vy', fmt(data.vy, 2));
        updateIfChanged('vz', fmt(data.vz, 2));
        // Battery (%)
        updateIfChanged('battery', (typeof data.battery === 'number' && !isNaN(data.battery)) ? Math.round(data.battery) : '—');
        // Roll, Pitch, Yaw
        updateIfChanged('roll', fmt(data.roll, 1));
        updateIfChanged('pitch', fmt(data.pitch, 1));
        updateIfChanged('yaw', fmt(data.yaw, 1));
        // Voltage
        updateIfChanged('voltage', (typeof data.voltage === 'number' && !isNaN(data.voltage)) ? (data.voltage.toFixed(2) + ' V') : '—');
        // Armed
        updateIfChanged('armed', typeof data.armed === 'boolean' ? (data.armed ? 'Yes' : 'No') : '—');
        // Mode
        updateIfChanged('mode', data.mode || '—');
        // Mission running
        updateIfChanged('is_mission_running', typeof data.is_mission_running === 'boolean' ? (data.is_mission_running ? 'Yes' : 'No') : '—');
        drawAttitudeIndicator(data.roll, data.pitch, data.yaw);
        setDroneModelOrientation(data.roll, data.pitch, data.yaw);
    } catch (error) {
        console.error('Failed to fetch telemetry:', error);
    }
}

// (Include the rest of your main.js code here, including drawAttitudeIndicator, drawDroneModel, and event listeners for buttons, all outside of any DOMContentLoaded wrapper)

setInterval(updateTelemetry, 1200);

// --- Placeholder functions for UI rendering ---
function drawAttitudeIndicator(roll, pitch, yaw) {
    // Update orientation values in the orientation card
    const rollEl = document.getElementById('roll');
    const pitchEl = document.getElementById('pitch');
    const yawEl = document.getElementById('yaw');
    if (rollEl) rollEl.textContent = (roll !== undefined && roll !== null) ? roll.toFixed(1) : '-';
    if (pitchEl) pitchEl.textContent = (pitch !== undefined && pitch !== null) ? pitch.toFixed(1) : '-';
    if (yawEl) yawEl.textContent = (yaw !== undefined && yaw !== null) ? yaw.toFixed(1) : '-';
    // Optionally, render a simple attitude indicator on the canvas
    const canvas = document.getElementById('attitude-indicator');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw horizon
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate((-roll || 0) * Math.PI / 180);
    ctx.fillStyle = '#181f2a';
    ctx.fillRect(-60, 0, 120, 60); // ground
    ctx.fillStyle = '#63b3ed';
    ctx.fillRect(-60, -60, 120, 60); // sky
    ctx.restore();
    // Draw center dot
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 6, 0, 2*Math.PI);
    ctx.fillStyle = '#4fd1c5';
    ctx.fill();
}
});

// --- Smooth drone model orientation animation ---
let droneModelState = {
    roll: 0,
    pitch: 0,
    yaw: 0
};
let droneModelAnimId = null;

function setDroneModelOrientation(targetRoll, targetPitch, targetYaw) {
    // Handle missing/NaN values
    if (typeof targetRoll !== 'number' || isNaN(targetRoll)) targetRoll = 0;
    if (typeof targetPitch !== 'number' || isNaN(targetPitch)) targetPitch = 0;
    if (typeof targetYaw !== 'number' || isNaN(targetYaw)) targetYaw = 0;
    // Cancel previous animation if running
    if (droneModelAnimId) cancelAnimationFrame(droneModelAnimId);
    animateDroneModelTo(targetRoll, targetPitch, targetYaw);
}

function animateDroneModelTo(targetRoll, targetPitch, targetYaw) {
    // Smoothing factor (0.18 = fast, 0.08 = slow)
    const alpha = 0.18;
    // Interpolate each axis
    droneModelState.roll += (targetRoll - droneModelState.roll) * alpha;
    droneModelState.pitch += (targetPitch - droneModelState.pitch) * alpha;
    droneModelState.yaw += (targetYaw - droneModelState.yaw) * alpha;
    // Redraw model
    drawDroneModel(droneModelState.roll, droneModelState.pitch, droneModelState.yaw);
    // If not close enough, keep animating
    if (Math.abs(droneModelState.roll - targetRoll) > 0.2 || Math.abs(droneModelState.pitch - targetPitch) > 0.2 || Math.abs(droneModelState.yaw - targetYaw) > 0.2) {
        droneModelAnimId = requestAnimationFrame(() => animateDroneModelTo(targetRoll, targetPitch, targetYaw));
    } else {
        // Snap to target
        drawDroneModel(targetRoll, targetPitch, targetYaw);
        droneModelState.roll = targetRoll;
        droneModelState.pitch = targetPitch;
        droneModelState.yaw = targetYaw;
        droneModelAnimId = null;
    }
}

// --- Draw drone model on canvas ---
function drawDroneModel(roll, pitch, yaw) {
    const canvas = document.getElementById('drone-3d');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // --- Faint grid ---
    ctx.save();
    ctx.strokeStyle = 'rgba(99,179,237,0.10)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();
    // --- Center and apply orientation ---
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    // 3D effect: yaw, then pitch/roll as skew
    // Defensive: clamp values to [-180, 180] for safety
    roll = Math.max(-180, Math.min(180, roll || 0));
    pitch = Math.max(-90, Math.min(90, pitch || 0));
    yaw = Math.max(-180, Math.min(180, yaw || 0));
    ctx.rotate((yaw * Math.PI/180));
    ctx.transform(1, Math.sin(pitch*Math.PI/180)*0.25, Math.sin(roll*Math.PI/180)*0.25, 1, 0, 0);
    // --- Axes (thin, subtle) ---
    // Z (blue, up)
    ctx.save();
    ctx.strokeStyle = 'rgba(99,179,237,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-44); ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-48,4,0,2*Math.PI); ctx.fillStyle = 'rgba(99,179,237,0.7)'; ctx.fill();
    ctx.restore();
    // X (red, right)
    ctx.save();
    ctx.strokeStyle = 'rgba(255,75,75,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(36,16); ctx.stroke();
    ctx.beginPath(); ctx.arc(40,18,3,0,2*Math.PI); ctx.fillStyle = 'rgba(255,75,75,0.7)'; ctx.fill();
    ctx.restore();
    // Y (green, forward)
    ctx.save();
    ctx.strokeStyle = 'rgba(56,178,172,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-24,30); ctx.stroke();
    ctx.beginPath(); ctx.arc(-28,34,3,0,2*Math.PI); ctx.fillStyle = 'rgba(56,178,172,0.7)'; ctx.fill();
    ctx.restore();
    // --- Drone body (diamond, crisp, no glow) ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0,-13);
    ctx.lineTo(13,0);
    ctx.lineTo(0,13);
    ctx.lineTo(-13,0);
    ctx.closePath();
    ctx.fillStyle = '#63b3ed';
    ctx.strokeStyle = '#232b3b';
    ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
    ctx.restore();
    // --- Arms (thin, crisp, white) ---
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.moveTo(-28,-28); ctx.lineTo(28,28);
    ctx.moveTo(-28,28); ctx.lineTo(28,-28);
    ctx.stroke();
    ctx.restore();
    // --- Rotors (white, subtle blue shadow) ---
    ctx.save();
    [[-28,-28],[28,28],[-28,28],[28,-28]].forEach(([x,y]) => {
        ctx.save();
        ctx.translate(x,y);
        ctx.beginPath(); ctx.arc(0,0,7,0,2*Math.PI);
        ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(99,179,237,0.35)'; ctx.shadowBlur = 7;
        ctx.fill();
        ctx.restore();
    });
    ctx.restore();
    ctx.restore();
}

async function showStatus(msg) {
    let statusEl = document.getElementById('status-msg');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'status-msg';
        statusEl.style.margin = '1rem auto';
        statusEl.style.textAlign = 'center';
        statusEl.style.fontWeight = 'bold';
        statusEl.style.color = 'var(--primary)';
        document.body.appendChild(statusEl);
    }
    statusEl.textContent = msg;
}

async function handleMissionButton(btnId, url, loadingMsg, successMsg, errorMsg) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = true;
    const origText = btn.innerHTML;
    btn.innerHTML = `<i class='fas fa-spinner fa-spin'></i> ${loadingMsg}`;
    try {
        const res = await fetch(url, {method: 'POST'});
        const data = await res.json();
        showStatus(data.status || successMsg);
    } catch (e) {
        showStatus(errorMsg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
    }
}

const armBtn = document.getElementById('arm-btn');
if (armBtn) {
    armBtn.onclick = function() {
        handleMissionButton('arm-btn', 'http://localhost:8000/api/arm', 'Arming...', 'ARM command sent!', 'Failed to ARM drone.');
    };
}
const disarmBtn = document.getElementById('disarm-btn');
if (disarmBtn) {
    disarmBtn.onclick = function() {
        handleMissionButton('disarm-btn', 'http://localhost:8000/api/disarm', 'Disarming...', 'DISARM command sent!', 'Failed to DISARM drone.');
    };
}
const takeoffBtn = document.getElementById('takeoff-btn');
if (takeoffBtn) {
    takeoffBtn.onclick = function() {
        handleMissionButton('takeoff-btn', 'http://localhost:8000/api/takeoff', 'Taking off...', 'Takeoff command sent!', 'Failed to take off.');
    };
}
const startBtn = document.getElementById('start-btn');
if (startBtn) {
    startBtn.onclick = function() {
        handleMissionButton('start-btn', 'http://localhost:8000/api/start_mission', 'Starting...', 'Mission started!', 'Failed to start mission.');
    };
}
const stopBtn = document.getElementById('stop-btn');
if (stopBtn) {
    stopBtn.onclick = function() {
        handleMissionButton('stop-btn', 'http://localhost:8000/api/stop_mission', 'Stopping...', 'Mission stopped!', 'Failed to stop mission.');
    };
}


document.querySelectorAll('.telemetry-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('active'));
    card.addEventListener('mouseleave', () => card.classList.remove('active'));
});

