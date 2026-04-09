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

// Baby trigger words
const BABY_TRIGGERS = [
  "baby", "bby", "babu", "bbu", "jan", "bot",
  "জান", "জানু", "বেবি", "wifey", "marin"
];

// Random replies (original Bangla)
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
  "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣",
  "Meow🐤", "🐤🐤",
  "হা বলো😒, কি করতে পারি😐?",
  "আজব তো__😒",
  "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤",
  "খাওয়া দাওয়া করসো 🙄",
  "কথা দেও আমাকে পটাবা...!! 😌",
  "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑",
  "বলো জানু 😒",
  "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
  "আমি হাজারো মশার Crush😓",
  "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
  "মন সুন্দর বানাও মুখের জন্য তো Snapchat আছেই! 🌚",
  "বার বার Disturb করেছিস, আমার জানুর সাথে ব্যাস্ত আসি 😋",
  "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 করিস 😾",
  "হটাৎ আমাকে মনে পড়লো 🙄",
  "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺",
  "ভুলে জাও আমাকে 😞",
  "দেখা হলে কাঠগোলাপ দিও..🤗",
  "বলো কি করতে পারি তোমার জন্য 😚",
  "Meow🐤", "oi mama ar dakis na pilis 😿",
  "একটা BF খুঁজে দাও 😿",
  "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘"
];

// Reply tracking
const replyMap = new Map();

const trackReply = (messageId) => {
  replyMap.set(messageId, true);
  if (replyMap.size > 300) {
    const first = replyMap.keys().next().value;
    replyMap.delete(first);
  }
};

module.exports = {
  DOMAINS,
  BABY_TRIGGERS,
  RANDOM_REPLIES,
  replyMap,
  trackReply
};
