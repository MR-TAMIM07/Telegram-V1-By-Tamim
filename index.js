const TelegramBot = require("node-telegram-bot-api");
const botConfig = require("./config/botConfig");
const messageHandler = require("./handlers/messageHandler");

const bot = new TelegramBot(botConfig.BOT_TOKEN, { polling: true });

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

console.log("🤖 ᴛᴀᴍɪᴍ ʙᴏᴛ ᴠ2.0 ɪs ʀᴜɴɴɪɴɢ...");
