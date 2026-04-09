const axios = require("axios");
const botConfig = require("../config/botConfig");

let cachedApiUrl = null;

const getBaseApiUrl = async () => {
  if (cachedApiUrl) return cachedApiUrl;
  try {
    const res = await axios.get(botConfig.BASE_API_URL);
    cachedApiUrl = res.data.mahmud;
    return cachedApiUrl;
  } catch (err) {
    console.error("Failed to fetch base API:", err.message);
    return "https://hinata-api.onrender.com";
  }
};

module.exports = {
  getBaseApiUrl
};
