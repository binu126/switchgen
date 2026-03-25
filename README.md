# ESP32 Smart Switch Hub (Full-Stack)

A professional, full-stack IoT control system featuring a responsive Web Dashboard, a Node.js Middleware Server, and ESP32 integration via MQTT.

## 🏗️ System Architecture

Unlike simple client-side controllers, this system uses a **Node.js backend** to manage device states and critical timer logic. This ensures that even if you close your browser, your scheduled timers continue to run on the server.

**Flow:** `Web UI` → `Node.js API` → `MQTT Broker` → `ESP32`

## 🚀 Key Features

* **Server-Side Timers:** High-reliability scheduling. Timers are processed on the backend to prevent interruption if the frontend is closed.
* **Input Validation:** Robust handling of negative values and invalid time entries.
* **Real-time Feedback:** Instant success/error notifications using a custom CSS animation system.
* **Modern "Slate & Emerald" UI:** A dark-mode dashboard built for high visibility and clean aesthetics.
* **MQTT Middleware:** Centralized command logging on the server for easier debugging.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Properties), JavaScript (ES6 Fetch API).
* **Backend:** Node.js, Express.js, CORS.
* **Communication:** MQTT.js (Middleware to Broker).
* **IoT Hardware:** ESP32 / ESP8226 (Subscribed to `home/control/#`).

## 📋 API Endpoints

### POST `/api/device`
Controls device state and scheduling.
**Payload:**
```json
{
  "device": "bulb",
  "state": "ON",
  "duration": 3600 
}