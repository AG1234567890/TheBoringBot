const { Client, Intents } = require('discord.js');
require('dotenv').config()
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", async () => {
    console.log("mogus");
    client.user.setStatus('dnd');
    client.user.setActivity('something', { type: 'PLAYING' });
  });

// Login to Discord with your client's token




client.on("messageCreate", async (message) => {
    if(message.content === "amongus") {
        message.reply("sdfsf")
    }
})

client.login(process.env.TOKEN);