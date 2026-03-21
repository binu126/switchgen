# ESP32 Smart Switch Web Controller

A modern, responsive web dashboard to control ESP32-based IoT devices using the **MQTT protocol**. This panel allows for real-time toggling of devices and includes a client-side timer feature.

## 🚀 Features

  * **Real-time Control:** Toggle devices (Bulb, Plug, Fan) instantly via MQTT.
  * **Live Status:** Visual indicators for MQTT broker connection status.
  * **Smart Timers:** Set specific durations for devices to stay ON before automatically turning OFF.
  * **Modern UI:** Built with Bootstrap 5, FontAwesome icons, and interactive CSS animations.
  * **Scalable Design:** Easy to add new devices by modifying a single JavaScript array.

## 🛠️ Tech Stack

  * **Frontend:** HTML5, CSS3, JavaScript (ES6+)
  * **Communication:** [MQTT.js](https://www.google.com/search?q=https://github.com/mqttjs/MQTT.js) via WebSockets
  * **Broker:** HiveMQ Public Broker (`wss://broker.hivemq.com:8884/mqtt`)

## 📋 MQTT Topic Structure

The panel publishes messages to the following topics:

  * **Bulb:** `home/control/bulb`
  * **Plug:** `home/control/plug`
  * **Fan:** `home/control/fan`

**Payloads:**

  * `ON`: Turns the device pin HIGH.
  * `OFF`: Turns the device pin LOW.

## 🔌 Hardware Setup (ESP32)

To use this panel with an ESP32, your C++ code must:

1.  Connect to the same HiveMQ broker.
2.  Subscribe to the topics listed above.
3.  Handle the `ON` and `OFF` string payloads in the MQTT callback function.

## ⚙️ Installation & Usage

1.  Clone this repository.
2.  Ensure `index.html` and `styles.css` are in the same folder.
3.  Open `index.html` in any modern web browser.
4.  Wait for the **"Connected"** status indicator (top right) to turn green.

## ⚠️ Security Note

This project currently uses a **public MQTT broker**. For production or private home use, it is highly recommended to:

  * Change the topic prefix to something unique (e.g., `yourname123/home/control/`).
  * Switch to a private broker with username/password authentication.
```

Does this cover everything you wanted to include, or should we add a section for "Future Improvements" (like adding sensors)?
