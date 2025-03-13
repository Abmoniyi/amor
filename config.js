const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
///=================When editing, do not accidentally delete anything !!MAIN-CONFIG=================================
SESSION_ID: process.env.SESSION_ID || "DJkUxQaC#InPRE5HA7NNCWaJUR6eTjc4Xq72kdr9VcfWpTIjATHw",
TIME_ZONE: process.env.TIME_ZONE || "Africa/Lagos",
LOCATION: "Ilorin/Nigeria",
EMAIL: "fareedjimoh06@gmail.com",
MODE: process.env.MODE || "public",
PREFIX: process.env.PREFIX || "#",
OWNER_REACT: process.env.OWNER_REACT || "false",
GURL: process.env.GURL || "https://whatsapp.com/channel/0029VahOucpCcW4s1Zk3O61A",
WEBSITE: process.env.WEBSITE || "https://whatsapp.com/channel/0029VahOucpCcW4s1Zk3O61A",
BOT_NAME: process.env.BOT_NAME || "ᴍᴀʀɪᴀ-ᴍᴅ",
AUTO_VOICE: process.env.AUTO_VOICE || "false",
AUTO_STICKER: process.env.AUTO_STICKER || "false",
AUTO_REPLY: process.env.AUTO_REPLY || "false",
ANTI_LINK: process.env.ANTI_LINK || "false", 
ANTI_BAD: process.env.ANTI_BAD || "false", 
FAKE_RECORDING: process.env.FAKE_RECORDING || "false",
AUTO_REACT: process.env.AUTO_REACT || "false",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "false",
OWNER_NUMBER: process.env.OWNER_NUMBER || "2347032411938",
OWNER_NAME: process.env.OWNER_NAME || "ᴀʙʙʏ ᴛᴇᴄʜ",
GOOGLE_CX: process.env.GOOGLE_CX || "AIzaSyD93IeJsouK51zjKgyHAwBIAlqr-a8mnME", 
PASTEBIN_API_KEY: process.env.PASTEBIN_API_KEY || "uh8QvO6vQJGtIug9WvjdTAPx_ZAFJAxn",
OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39"
};
