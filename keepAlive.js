// Keep-alive script for Render free tier
const https = require("https");

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://telegram-v1-by-tamim.onrender.com";
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 14 * 60 * 1000; // 14 minutes

console.log("💓 Keep-alive worker started");
console.log(`📡 Monitoring: ${WEBHOOK_URL}`);
console.log(`⏱️  Ping interval: ${PING_INTERVAL / 1000}s`);

function pingServer() {
  const url = new URL(WEBHOOK_URL);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: "/",
    method: "GET",
    timeout: 10000,
  };

  const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const time = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka" });
      console.log(`[${time}] ✅ Ping successful | Status: ${res.statusCode} | Response: ${data}`);
    });
  });

  req.on("error", (err) => {
    const time = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka" });
    console.log(`[${time}] ❌ Ping failed: ${err.message}`);
  });

  req.on("timeout", () => {
    req.destroy();
    const time = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka" });
    console.log(`[${time}] ⏰ Ping timeout`);
  });

  req.end();
}

// Initial ping
pingServer();

// Schedule pings
setInterval(pingServer, PING_INTERVAL);

// Keep process alive
process.on("SIGTERM", () => {
  console.log("👋 Worker shutting down...");
  process.exit(0);
});
