const { DOMAINS } = require("./constants");

const detectPlatform = (url) => {
  if (/youtube\.com|youtu\.be/i.test(url)) return "ʏᴏᴜᴛᴜʙᴇ";
  if (/facebook\.com|fb\.watch|fb\.com/i.test(url)) return "ғᴀᴄᴇʙᴏᴏᴋ";
  if (/tiktok\.com/i.test(url)) return "ᴛɪᴋᴛᴏᴋ";
  if (/instagram\.com|instagr\.am/i.test(url)) return "ɪɴsᴛᴀɢʀᴀᴍ";
  if (/spotify\.com/i.test(url)) return "sᴘᴏᴛɪғʏ";
  if (/soundcloud\.com/i.test(url)) return "sᴏᴜɴᴅᴄʟᴏᴜᴅ";
  if (/twitter\.com|x\.com/i.test(url)) return "ᴛᴡɪᴛᴛᴇʀ/x";
  return "ᴍᴇᴅɪᴀ";
};

const isVideoLink = (text) => {
  if (!text) return false;
  return DOMAINS.some(d => text.toLowerCase().includes(d));
};

module.exports = {
  detectPlatform,
  isVideoLink
};
