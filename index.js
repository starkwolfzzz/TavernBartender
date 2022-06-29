const express = require('express');
const app = express();
const port = 25623;

app.get('/', (req, res) => res.send('Tavern Bartender#8741 is online and is streaming with @Stark Wolfz#9300'));

app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

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

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: false,
    deafenOnJoin: true,
    quality: `high`,
    leaveOnEmpty: false,
});

player.on('queueEnd', (q) => q.stop())
    .on('songChanged', (q, newSong, oldSong) => {
        if (q.data.channel) q.data.channel.send(`:thumbsup: Now Playing ***${newSong.name}***`)
    }).on('songAdd', (q, song) => {
        if (q.data.channel)
            if (q.songs.length > 1) q.data.channel.send(`:thumbsup: Added ***${song.name}*** to the queue`)
    }).on('playlistAdd', (q, playlist) => {
        if (q.data.channel) q.data.channel.send(`:thumbsup: Added playlist ***${playlist}*** with ${playlist.songs.length} to the queue.`)
    }).on('songFirst', (q, song) => {
        if (q.data.channel) q.data.channel.send(`:thumbsup: Now Playing ***${song.name}***`)
    }).on('error', (error, q) => {
        console.log(`Error: ${error} in ${q.guild.name}`);
    }).on('channelEmpty', (q) => {
        q.stop();
        q.data.channel.send(`Everyone left the voice channel, queue ended`)
    }).on('clientDisconnect', (q) => {
        q.data.channel.send(`I was kicked from the Voice Channel, queue ended.`)
    });
client.player = player;

const fs = require('fs');
const path = require('path');

if(fs.existsSync("./.dev")){
    client.devMode = true;
}

const { DisTube } = require('distube');
const { SpotifyPlugin }   = require('@distube/spotify')

client.genius = process.env.GENIUS_TOKEN
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    leaveOnStop: false,
    emitAddSongWhenCreatingQueue: false,
    updateYouTubeDL: false,
    emptyCooldown: 300,
    youtubeDL: false,
    plugins: [new SpotifyPlugin({
        emitEventsAfterFetching: false,
        api: {
          clientId: process.env['SPOTIFYID'],
          clientSecret: process.env['SPOTIFYSECRET'],
        },
      })]
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
    //console.log("connected to mongodb database");
}).catch((err) => {
    console.log(err);
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

client.on(`rateLimit`, (data) => {
    console.log(data)
})

module.exports.changeCfg = function(prefix, volume) {
    changeConfig({ prefix, volume })
}

module.exports.changeAFK = function(userId, userName, type = "add") {
    changeAFK(userId, userName, type = "add")
}