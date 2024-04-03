require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Discord = require('discord.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Attachment } = require('discord.js');

const app = express();
app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  }
});
const upload = multer({ storage: storage });

// Discord client setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
        // ...
    ]
})

const token = process.env.BOT_TOKEN;

if (!token || typeof token !== 'string') {
  throw new Error('Invalid Discord bot token. Please provide a valid token.');
}
client.login(process.env.BOT_TOKEN);

// Endpoint to handle file upload
app.post('/sendFile', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    console.log(file.path);

    // Check if file is uploaded
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // const fileSize = file; // Access file size directly

    // Send the file to Discord
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const attachment = new Discord.Attachment(file.path);
    const message = await channel.send({ files: [attachment] });

    // Get the URL of the uploaded file
    const url = message.attachments.first().url;

    // Delete the uploaded file from the server (optional)
    fs.unlinkSync(file.path);

    // Send the URL back as JSON response
    res.json({ url });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});