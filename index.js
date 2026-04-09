const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const botConfig = require("./config/botConfig");
const messageHandler = require("./handlers/messageHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Render
app.get("/", (req, res) => {
  res.send("🤖 ᴛᴀᴍɪᴍ ʙᴏᴛ ɪs ʀᴜɴɴɪɴɢ!");
});

// Webhook mode (better for Render free tier)
const bot = new TelegramBot(botConfig.BOT_TOKEN, { webHook: true });

// Set webhook URL
const WEBHOOK_URL = "https://telegram-v1-by-tamim.onrender.com";
bot.setWebHook(`${WEBHOOK_URL}/bot${botConfig.BOT_TOKEN}`);

// Webhook endpoint
app.post(`/bot${botConfig.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Import commands
require("./commands/start")(bot);
require("./commands/help")(bot);
require("./commands/info")(bot);
require("./commands/ping")(bot);
require("./commands/dl")(bot);
require("./commands/chat")(bot);

// Message handler for auto detection
bot.on("message", (msg) => messageHandler(bot, msg));

// Error handling
bot.on("polling_error", (error) => console.error("Polling error:", error.message));
bot.on("error", (error) => console.error("Bot error:", error.message));
bot.on("webhook_error", (error) => console.error("Webhook error:", error.message));

// Keep-alive self-ping (prevents Render sleep)
setInterval(() => {
  const https = require("https");
  https.get(WEBHOOK_URL, (res) => {
    console.log("💓 Keep-alive ping sent");
  }).on("error", (err) => {
    console.log("Keep-alive error:", err.message);
  });
}, 14 * 60 * 1000); // Ping every 14 minutes

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🤖 ᴛᴀᴍɪᴍ ʙᴏᴛ ɪs ʀᴜɴɴɪɴɢ (Webhook Mode)");
});
