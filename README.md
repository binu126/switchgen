# ESP32 Smart Switch Hub

A IoT control system featuring a responsive Web Dashboard, a Node.js Middleware Server, and ESP32 integration via MQTT.This system uses a **Node.js backend** to manage device states and critical timer logic. This ensures that even if you close your browser, your scheduled timers continue to run on the server.

**Flow:** `Web UI` → `Node.js API` → `MQTT Broker` → `ESP32`

## 🚀 Key Features

* **Server-Side Timers:** High-reliability scheduling. Timers are processed on the backend to prevent interruption if the frontend is closed.
* **Input Validation:** Robust handling of negative values and invalid time entries.
* **Modern "Slate & Emerald" UI:** A dark-mode dashboard built for high visibility and clean aesthetics.
* **MQTT Middleware:** Centralized command logging on the server for easier debugging.

## ⚠️ Important Note: Communication Model

This system currently operates on a **One-Way (Uni-directional)** control flow.

* **No Real-time Status:** The dashboard sends commands *to* the devices but does not currently receive "State" updates *from* them. 
* **State Assumption:** The UI reflects the last command sent by the server, rather than the confirmed physical state of the hardware. 
* **Synchronization:** If a device loses power or is toggled via a physical manual switch, the dashboard will not auto-update to reflect that change.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Properties), JavaScript (ES6 Fetch API).
* **Backend:** Node.js, Express.js.
* **Communication:** MQTT.js (Middleware to Broker).
* **IoT Hardware:** ESP32 / ESP8226 (Subscribed to `home/control/#`).

```json
{
  "device": "bulb",
  "state": "ON",
  "duration": 3600 
}
