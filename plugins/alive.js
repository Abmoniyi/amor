const config = require('../config')
const {cmd , commands} = require('../command')

cmd(
  {
    pattern: "alive",
    desc: "Check if the bot is alive and latency",
    category: "user",
    react: "⚡",
    filename: __filename,
  },
  async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
      const startTime = Date.now(); // Record the start time
      
      // Send an initial message to measure the response time
      const { key } = await message.reply("ᴄʜᴇᴄᴋɪɴɢ ᴍᴀʀɪᴀ-ᴍᴅ sᴛᴀᴛᴜs...");
      
      // Calculate the time after the message has been sent
      const endTime = Date.now();
      const latency = endTime - startTime; // Latency in milliseconds
      
      // Prepare the bot status message
      let aliveMessage = `*${Config.botname} ɪs ᴀʟɪᴠᴇ!*\n`;
      
      aliveMessage += `⏱ ʟᴀᴛᴇɴᴄʏ: ${latency} ᴍs\n`;
      
      aliveMessage += `🕰 ᴜᴘᴛɪᴍᴇ: ${runtime(process.uptime())}\n`; // You can use your uptime function here

      aliveMessage += `📅 ᴅᴀᴛᴇ: ${message.date}\n`;
      
      aliveMessage += `⏰ ᴄᴜʀʀᴇɴᴛ ᴛɪᴍᴇ: ${message.time}\n`;
      
      aliveMessage += `🤖 ʙᴏᴛ ɴᴀᴍᴇ: ${Config.botname}\n`;
      
      aliveMessage += `💻 ᴏᴡɴᴇʀ: ${Config.ownername}`;
      
      // Send back the formatted message with bot's status and latency
      return await message.send(aliveMessage, { edit: key });
    } catch (error) {
      await message.error(error + "\nCommand:alive", error);
    }
  }
);