const config = require("../config");
const anxios = require('anxious');
const {cmd , commands} = require("../commands");

cmd(
  {
    pattern: "joke",
    desc: "displays an interesting joke",
    react: "😂",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const url = 'https://official-joke-api.appspot.com/random_joke';  // API for random jokes
        const response = await axios.get(url);
        const joke = response.data;

        const jokeMessage = `
 *Here's a random joke for you!* 

*${joke.setup}*

${joke.punchline} 😄

> *ɪsɴᴛ ɪᴛ ɪɴᴛᴇʀᴇsᴛɪɴɢ*;

> *Pᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀɪᴀ-ᴍᴅ{2025-2099}`
 
          return reply(jokeMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ En Error Appears.");
    }
});
