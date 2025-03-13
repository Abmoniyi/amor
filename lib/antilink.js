// antilink.js

const antiLink = async (message, client, settings) => {
  // Regex pattern to detect URLs
  const linkPattern = /(https?:\/\/[^\s]+)/g;

  // Ensure message contains text and check for a URL
  if (message.body && linkPattern.test(message.body)) {
    try {
      // Get chat and sender details
      const chat = await message.getChat();
      const sender = message.from;
      const isGroupChat = chat.isGroup;

      // Settings: action configuration
      const { action, warningMessage, deleteMessage, kickOnLink } = settings;

      // Logging action for debug purposes
      console.log(`Detected link in message from ${sender}. Action: ${action}`);

      // Action: Warn the user
      if (action === 'warn' || action === 'both') {
        if (warningMessage) {
          await message.reply(warningMessage || "Please refrain from sending links in this chat.");
          console.log(`Warned ${sender} for sending a link.`);
        } else {
          await message.reply("Please refrain from sharing links in this chat. This is a warning.");
          console.log(`Warned ${sender} (default message).`);
        }
      }

      // Action: Delete the message
      if ((action === 'delete' || action === 'both') && deleteMessage) {
        await message.delete();
        console.log(`Message from ${sender} containing a link was deleted.`);
      }

      // Action: Kick the user (only works in group chats)
      if (action === 'kick' && isGroupChat && kickOnLink) {
        await chat.removeParticipants([sender]);
        console.log(`User ${sender} was kicked for sending a link.`);
      }
      
      // Custom message or logging for any unhandled scenarios
      if (action !== 'warn' && action !== 'delete' && action !== 'kick') {
        console.log(`No valid action set for message from ${sender}`);
      }
      
    } catch (error) {
      console.error("Error in antiLink.js: ", error);
    }
  }
};

// Default settings for actions (can be modified dynamically or loaded from a config file)
const defaultSettings = {
  action: 'both', // Options: 'warn', 'delete', 'kick', 'both'
  warningMessage: "Please refrain from sharing links. This is a warning.", // Custom warning message
  deleteMessage: true, // Whether to delete the message containing a link
  kickOnLink: false, // Whether to kick users for sending links
};

module.exports = { antiLink, defaultSettings };
