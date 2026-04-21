import express from "express";
import cors from "cors";
import { client, isConnected } from "./mqttClient.js";

const app = express();

app.use(cors());
app.use(express.json());

// Object to store active timers so we can cancel them if needed
const activeTimers = {};

app.post("/api/device", (req, res) => {
    const { device, state, duration } = req.body;

    if (!device || !state) {
        return res.status(400).json({ error: "Missing device or state" });
    }

    if (!isConnected) {
        return res.status(503).json({ error: "MQTT broker not connected" });
    }

    const topic = `home/control/${device}`;

    // 1. Clear any existing timer for this specific device
    if (activeTimers[device]) {
        console.log(`🛑 Existing timer cleared for ${device}`);
        clearTimeout(activeTimers[device]);
        delete activeTimers[device];
    }

    // 2. Publish the initial state (e.g., "ON")
    client.publish(topic, state);
    console.log(`📤 ${state} → ${topic}`);

    // 3. If a duration was provided, schedule the "OFF" command
    if (duration && state === 'ON') {
        const durationMs = duration * 1000;
        
        console.log(`⏱️ Timer set: ${device} will turn OFF in ${duration} seconds`);

        activeTimers[device] = setTimeout(() => {
            if (isConnected) {
                client.publish(topic, "OFF");
                console.log(`⏰ Timer Expired: OFF → ${topic}`);
            } else {
                console.warn(`⏰ Timer Expired but MQTT disconnected: ${topic}`);
            }
            delete activeTimers[device];
        }, durationMs);
    }

    res.json({ 
        success: true, 
        message: duration ? `Scheduled OFF in ${duration}s` : `Command ${state} sent` 
    });
});

app.get("/api/status", (req, res) => {
    res.json({ mqtt: isConnected ? "connected" : "disconnected" });
});

app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});

app.listen(3000, () => {
    console.log("🔥 Server running on http://localhost:3000");
});