const express = require('express');
const app = express();

// ================= START BOT CODE ===================

require('dotenv').config();

const {
    Client,
    Intents
} = require('discord.js');

const client = new Client({
    partials: ["CHANNEL"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

const {
    createAudioPlayer
} = require('@discordjs/voice');

const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);

const fs = require('fs');
const path = require('path');

if(fs.existsSync("./.dev")){
    client.devMode = true;
}

const { DisTube } = require('distube');
const { SpotifyPlugin }   = require('@distube/spotify')
const { YtDlpPlugin } = require("@distube/yt-dlp");

client.genius = process.env.GENIUS_TOKEN;
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    leaveOnStop: false,
    emitAddSongWhenCreatingQueue: false,
    emptyCooldown: 300,
    youtubeDL: false,
    plugins: [new SpotifyPlugin({
        emitEventsAfterFetching: false,
        api: {
          clientId: process.env['SPOTIFYID'],
          clientSecret: process.env['SPOTIFYSECRET'],
        },
      }), new YtDlpPlugin({ update: true })]
})
module.exports = client;
require('./events/distube/distubeEvents.js')

client.ttsPlayer = createAudioPlayer();

var loop = "none";
client.loop = loop;

const mongoose = require("mongoose");
const { config } = require('dotenv');

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
}).then(async() => {
    client.databaseStatus = "Connected";
}).catch((err) => {
    console.log(err);
    client.databaseStatus = `Error: ${err}`;
})

client.mongoose = mongoose;

function changeConfig(data) {
    let filePath = "./config.json";
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

function changeAFK(userId, reason, type = "add") {
    let filePath = "./afk.json";
    let timestamp = Date.now();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            if (type == "add") {
                obj.users[userId] = [reason, timestamp];
            } else {
                delete obj.users[userId];
            }

            json = JSON.stringify(obj);
            fs.writeFile(filePath, json, 'utf8', () => {});
        }
    });
}

const readHandlers = async dir => {
    const handlerFiles = fs.readdirSync(path.join(__dirname, dir));
    for (const file of handlerFiles) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readHandlers(path.join(dir, file))
        } else {
            const handler = require(path.join(__dirname, dir, file));
            try {
                await handler.execute(client);
            } catch (error) {
                if (error) console.error(error);
            }
        }
    }
}

readHandlers('handlers')

client.login(process.env['TOKEN']);

/*client.on(`rateLimit`, (data) => {
    console.log(data)
})*/

module.exports.changeCfg = function(prefix, volume) {
    changeConfig({ prefix, volume })
}

module.exports.changeAFK = function(userId, userName, type = "add") {
    changeAFK(userId, userName, type = "add")
}