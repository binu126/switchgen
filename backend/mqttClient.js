import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.hivemq.com");

let isConnected = false;

client.on("connect", () => {
    isConnected = true;
    console.log("✅ MQTT connected");
});

client.on("close", () => {
    isConnected = false;
    console.log("❌ MQTT disconnected");
});

client.on("error", (err) => {
    console.error("MQTT error:", err);
});

export { client, isConnected };
export default client;