const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

const app = express();
const PORT = process.env.PORT || 3000;

// Bot configuration
const BOT_TOKEN = "8643206314:AAG4W1fqTepqktrE_xzxbn4KI9GY1x1X188";
const DOWNLOAD_API = "https://xsaim8x-xxx-api.onrender.com/api/auto";

// POLLING MODE - More reliable for Render free tier
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log("🤖 Bot started in POLLING mode");

// Health check endpoint
app.get("/", (req, res) => {
  res.send("🤖 ᴛᴀᴍɪᴍ ʙᴏᴛ ɪs ʀᴜɴɴɪɴɢ!");
});

// Domains for video links
const DOMAINS = [
  "facebook.com", "fb.watch", "fb.com",
  "youtube.com", "youtu.be",
  "tiktok.com",
  "instagram.com", "instagr.am",
  "spotify.com", "soundcloud.com",
  "twitter.com", "x.com",
  "pinterest.com", "pin.it",
  "likee.com", "likee.video"
];

// Baby triggers
const BABY_TRIGGERS = [
  "baby", "bby", "babu", "bbu", "jan", "bot",
  "জান", "জানু", "বেবি", "wifey", "marin"
];

// Random replies (Bangla + English)
const RANDOM_REPLIES = [
  "Bolo baby 😒", "I love you 😘",
  "babu khuda lagse🥺", "Hop beda😾, Boss বল boss😼",
  "আমাকে ডাকলে কিস করে দেবো😘",
  "mb ney bye", "meww 🐤",
  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏",
  "গোসল করে আসো যাও😑😩",
  "বলেন sir__😌", "বলেন ম্যাডাম__😌",
  "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
  "𝗕𝗯𝘆 না জানু, বল 😌",
  "বেশি bby Bbby করলে leave নিবো কিন্তু 😒",
  "__বেশি বেবি বললে কামুর দিমু 🤭",
  "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂",
  "bolo baby😒",
  "Meow🐤", "🐤🐤",
  "হা বলো😒, কি করতে পারি😐?",
  "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤",
  "খাওয়া দাওয়া করসো 🙄",
  "বলো জানু 😒",
  "Meow🐤", "oi mama ar dakis na pilis 😿",
  "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘"
];

// Reply tracking
const replyMap = new Map();

function trackReply(messageId) {
  replyMap.set(messageId, true);
  if (replyMap.size > 300) {
    const first = replyMap.keys().next().value;
    replyMap.delete(first);
  }
}

// Helpers
function detectPlatform(url) {
  if (/youtube\.com|youtu\.be/i.test(url)) return "ʏᴏᴜᴛᴜʙᴇ";
  if (/facebook\.com|fb\.watch|fb\.com/i.test(url)) return "ғᴀᴄᴇʙᴏᴏᴋ";
  if (/tiktok\.com/i.test(url)) return "ᴛɪᴋᴛᴏᴋ";
  if (/instagram\.com|instagr\.am/i.test(url)) return "ɪɴsᴛᴀɢʀᴀᴍ";
  if (/spotify\.com/i.test(url)) return "sᴘᴏᴛɪғʏ";
  if (/soundcloud\.com/i.test(url)) return "sᴏᴜɴᴅᴄʟᴏᴜᴅ";
  if (/twitter\.com|x\.com/i.test(url)) return "ᴛᴡɪᴛᴛᴇʀ/x";
  return "ᴍᴇᴅɪᴀ";
}

function isVideoLink(text) {
  if (!text) return false;
  return DOMAINS.some(d => text.toLowerCase().includes(d));
}

// /start command
bot.onText(/\/start/, async (msg) => {
  const name = msg.from.first_name || "User";
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "N/A";

  const welcomeMsg = 
`╭━━━━❰ ᴛᴀᴍɪᴍ ʙᴏᴛ ❱━━━━➣
┃
┃  👋 ʜᴇʟʟᴏ, ${name}!
┃  ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴏsᴛ
┃  ᴘᴏᴡᴇʀғᴜʟ ᴍᴇᴅɪᴀ ʙᴏᴛ.
┃
┃  ┏━━━━━━━━━━━━━━━━━━┓
┃  ┃  👤 ᴜsᴇʀ: ${name}
┃  ┃  🆔 ɪᴅ: ${userId}
┃  ┃  🌐 ᴜsᴇʀɴᴀᴍᴇ: ${username}
┃  ┗━━━━━━━━━━━━━━━━━━┛
┃
┃  ✨ ɪ ᴄᴀɴ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏs ғʀᴏᴍ
┃  ғᴀᴄᴇʙᴏᴏᴋ, ʏᴛ, ᴛɪᴋᴛᴏᴋ & ᴍᴏʀᴇ!
┃
┃  💬 ᴀʟsᴏ, ɪ ᴄᴀɴ ᴄʜᴀᴛ ʟɪᴋᴇ ᴀ ʙᴀʙʏ.
┃  ᴛʏᴘᴇ /help ᴛᴏ sᴇᴇ ᴍʏ ᴘᴏᴡᴇʀ.
┃
┃  🔗 ᴛ.ᴍᴇ/ɪᴛsᴍᴇᴛᴀᴍɪᴍ404
╰━━━━━━━━━━━━━━━━━━━━━➣
       © ᴍᴀᴅᴇ ʙʏ ᴛᴀᴍɪᴍ`;

  await bot.sendMessage(msg.chat.id, welcomeMsg);
});

// /help command
bot.onText(/\/help/, (msg) => {
  const helpMsg = 
`╔═════ 📄 ʜᴇʟᴘ ᴍᴇɴᴜ ═════╗

  📥 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ᴄᴏᴍᴍᴀɴᴅs
  ━━━━━━━━━━━━━━━━━━━
  ◈ /dl <url> - ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇᴅɪᴀ
  ◈ ᴊᴜsᴛ sᴇɴᴅ ᴀɴʏ ʟɪɴᴋ ᴅɪʀᴇᴄᴛʟʏ

  💬 ᴄʜᴀᴛ ᴄᴏᴍᴍᴀɴᴅs
  ━━━━━━━━━━━━━━━━━━━
  ◈ /chat <msg> - ᴛᴀʟᴋ ᴛᴏ ᴀɪ
  ◈ ᴛʀɪɢɢᴇʀs: ʙʙʏ, ʙᴀʙʏ, ᴊᴀɴ, ʙᴏᴛ

  ⚙️ ᴏᴛʜᴇʀ ᴄᴏᴍᴍᴀɴᴅs
  ━━━━━━━━━━━━━━━━━━━
  ◈ /start - ʀᴇsᴛᴀʀᴛ
  ◈ /info  - ᴀᴄᴄᴏᴜɴᴛ ɪɴғᴏ
  ◈ /ping  - ʙᴏᴛ sᴘᴇᴇᴅ

  🔗 ᴛ.ᴍᴇ/ɪᴛsᴍᴇᴛᴀᴍɪᴍ404
╚═════════════════════╝
       ⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴀᴍɪᴍ`;

  bot.sendMessage(msg.chat.id, helpMsg);
});

// /info command
bot.onText(/\/info/, (msg) => {
  const name = msg.from.first_name || "User";
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "N/A";

  bot.sendMessage(msg.chat.id,
`╔═════ 👤 ᴜsᴇʀ ɪɴғᴏ ═════╗

  ┃  👤 ɴᴀᴍᴇ     : ${name}
  ┃  🆔 ᴜsᴇʀ ɪᴅ  : ${userId}
  ┃  🌐 ᴜsᴇʀɴᴀᴍᴇ : ${username}

╚═════════════════════╝
       ⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴀᴍɪᴍ`
  );
});

// /ping command
bot.onText(/\/ping/, async (msg) => {
  const start = Date.now();
  const sent = await bot.sendMessage(msg.chat.id, `🏓 ᴘɪɴɢɪɴɢ...`);
  const ping = Date.now() - start;
  await bot.editMessageText(
`╔═════ 🏓 ᴘɪɴɢ ═════╗

  ┃  ⚡ sᴘᴇᴇᴅ  : ${ping}ᴍs
  ┃  ✅ sᴛᴀᴛᴜs : ᴏɴʟɪɴᴇ

╚══════════════════╝
       ᴛᴀᴍɪᴍ ʙᴏᴛ`,
    { chat_id: msg.chat.id, message_id: sent.message_id }
  );
});

// /dl command
bot.onText(/\/dl (.+)/, async (msg, match) => {
  const url = match[1].trim();
  const chatId = msg.chat.id;

  if (!isVideoLink(url)) {
    return bot.sendMessage(chatId, `❌ ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ ʟɪɴᴋ!\n\nsᴜᴘᴘᴏʀᴛᴇᴅ: ʏᴏᴜᴛᴜʙᴇ, ғʙ, ᴛɪᴋᴛᴏᴋ, ɪɢ, ᴛᴡɪᴛᴛᴇʀ, sᴘᴏᴛɪғʏ`);
  }

  const platform = detectPlatform(url);
  const loading = await bot.sendMessage(chatId, `♻️ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ғʀᴏᴍ ${platform}...`);

  const isAudio = url.includes("spotify") || url.includes("soundcloud");
  const ext = isAudio ? "mp3" : "mp4";
  const filePath = path.join("/tmp", `tamim_${Date.now()}.${ext}`);

  try {
    const apiRes = await axios.get(DOWNLOAD_API, {
      params: { url },
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const data = apiRes.data;

    let mediaURL = data.high_quality || data.url ||
      (data.result && data.result.url) ||
      (data.data && data.data.url) ||
      data.media || data.video || data.audio || data.link;

    if (!mediaURL) {
      await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
      return bot.sendMessage(chatId, `⚠️ ᴄᴏᴜʟᴅ ɴᴏᴛ ᴇxᴛʀᴀᴄᴛ ᴠɪᴅᴇᴏ ᴜʀʟ!\nᴛʀʏ ᴀɴᴏᴛʜᴇʀ ʟɪɴᴋ.`);
    }

    const fileRes = await axios({
      method: "get",
      url: mediaURL,
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 120000
    });

    const writer = fs.createWriteStream(filePath);
    await streamPipeline(fileRes.data, writer);

    const title = data.title || data.caption || platform;
    const filesize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);

    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});

    const caption =
`╭─ 🎀 ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ ─╮
│
│ 📌 ᴛɪᴛʟᴇ    : ${title}
│ 🌐 ᴘʟᴀᴛғᴏʀᴍ : ${platform}
│ 📦 ᴛʏᴘᴇ     : ${isAudio ? "ᴀᴜᴅɪᴏ 🎧" : "ᴠɪᴅᴇᴏ 🎬"}
│ 💾 sɪᴢᴇ     : ${filesize} ᴍʙ
│ ✅ sᴛᴀᴛᴜs   : sᴜᴄᴄᴇss
│
│ ✨ ᴇɴᴊᴏʏ ʏᴏᴜʀ ᴍᴇᴅɪᴀ ʙᴀʙʏ 🐥
│
╰─────────────────────╯
♡— ᴛᴀᴍɪᴍ ⸙`;

    if (isAudio) {
      await bot.sendAudio(chatId, filePath, { caption });
    } else {
      await bot.sendVideo(chatId, filePath, { caption });
    }

    fs.unlinkSync(filePath);

  } catch (err) {
    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Download error:", err.message);
    bot.sendMessage(chatId, `❌ ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ!\n\`${err.message.slice(0, 100)}\``);
  }
});

// /chat command
bot.onText(/\/chat (.+)/, async (msg, match) => {
  const text = match[1].trim();
  const chatId = msg.chat.id;
  
  try {
    const res = await axios.post("https://hinata-api.onrender.com/api/hinata", {
      text: text,
      style: 3,
      attachments: []
    }, { timeout: 30000 });
    
    const reply = res.data?.message || "baby i didn't understand 🥹";
    const sent = await bot.sendMessage(chatId, reply, { reply_to_message_id: msg.message_id });
    trackReply(sent.message_id);
  } catch (err) {
    const fallback = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
    bot.sendMessage(chatId, fallback, { reply_to_message_id: msg.message_id });
  }
});

// Auto detect messages
bot.on("message", async (msg) => {
  const text = msg.text || "";
  if (!text || text.startsWith("/")) return;

  const lower = text.toLowerCase().trim();
  const urlMatch = text.match(/https?:\/\/[^\s]+/);

  // Video link
  if (urlMatch && isVideoLink(urlMatch[0])) {
    bot.emit("text", { ...msg, text: `/dl ${urlMatch[0]}` });
    return;
  }

  // Reply to bot
  if (msg.reply_to_message && replyMap.has(msg.reply_to_message.message_id)) {
    bot.emit("text", { ...msg, text: `/chat ${lower}` });
    return;
  }

  // Baby trigger
  const matchedTrigger = BABY_TRIGGERS.find(w => lower.startsWith(w));
  if (matchedTrigger) {
    const afterTrigger = lower.substring(matchedTrigger.length).trim();
    if (!afterTrigger) {
      const reply = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      const sent = await bot.sendMessage(msg.chat.id, reply, { reply_to_message_id: msg.message_id });
      trackReply(sent.message_id);
    } else {
      bot.emit("text", { ...msg, text: `/chat ${afterTrigger}` });
    }
  }
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🤖 ᴛᴀᴍɪᴍ ʙᴏᴛ ɪs ʀᴇᴀᴅʏ! (POLLING MODE)");
});

// Self ping to keep alive
setInterval(() => {
  https.get(`https://telegram-v1-by-tamim-d7n6.onrender.com`, (res) => {
    console.log(`💓 Keep-alive ping | Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.log(`⚠️ Ping error: ${err.message}`);
  });
}, 14 * 60 * 1000); // Every 14 minutes
