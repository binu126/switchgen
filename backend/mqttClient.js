import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
    console.log("✅ MQTT connected");
});

client.on("error", (err) => {
    console.error("MQTT error:", err);
});

export default client;