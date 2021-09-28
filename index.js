const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Tavern Bartender#8741 is online and is streaming with @Stark Wolfz#9300'));

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================

require('dotenv').config();
const config = require("./config.json");

const {
    Client,
    Intents,
    Collection,
    MessageEmbed
} = require('discord.js');

const {
    REST
} = require('@discordjs/rest');

const {
    Routes
} = require('discord-api-types/v9');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const {
    joinVoiceChannel,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');

const fs = require('fs');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENTID;
const GUILD_ID = process.env.GUILD_ID;

var prefix = config.prefix;
var volume = config.volume;

var player = createAudioPlayer();

const videoFinder = async(query) => {
    const videoResult = await ytSearch(query);

    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

}


var resource;
var queue = [];
var current;
var loop = "none";

function changeConfig(data) {
    filePath = "./config.json";
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

function changePrefix(prefix) {
    prefix = prefix;
    changeConfig("./config.json", { prefix, volume })
}

const slashCommands = [];
client.slashCommands = new Collection();

const slashCommandFiles = fs.readdirSync('./slashCommands/').filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${file}`);

    if (slashCommand.Perms) slashCommand.defaultPermission = false;

    slashCommands.push(slashCommand);
    client.slashCommands.set(slashCommand.name, slashCommand);
}

client.login(TOKEN);

client.on('ready', async() => {
    var type = "streaming";
    client.user.setStatus("online");
    client.user.setActivity("with @Stark Wolfz#9300", {
        type: type.toUpperCase(),
        url: "https://twitch.tv/starkwolfzz"
    });

    console.info(`${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`);

    //Slash commands

    const mainGuild = await client.guilds.cache.get(GUILD_ID);

    mainGuild.commands.set(slashCommands).then((cmd) => {
        const Roles = (commandName) => {
            const cmdPerms = slashCommands.find(c => c.name === commandName).Perms;

            if (!cmdPerms) return null;

            return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
        }

        const fullPermissions = cmd.reduce((accumulator, x) => {
            const roles = Roles(x.name);
            if (!roles) return accumulator;

            const permissions = roles.reduce((a, v) => {
                return [...a, { id: v.id, type: "ROLE", permission: true }]
            }, []);

            return [...accumulator, { id: x.id, permissions }]
        }, []);

        mainGuild.commands.permissions.set({ fullPermissions });
        console.log("Updated slash commands");
    })

});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    //checks without the prefix

    if (message.channel.name == "music") {
        if (message.content.startsWith("https://www.youtube.com") || message.content.startsWith("https://youtu.be") || message.content.startsWith("https://youtube.com")) {
            const voiceChannel = message.member.voice.channel;

            if (voiceChannel != null) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                })

                const connection1 = getVoiceConnection(voiceChannel.guild.id);

                if (ytdl.validateURL(message.content)) {
                    const keywords = await message.content
                    const video = await videoFinder(keywords);

                    if (video) {

                        if (current != null) {
                            queue.push(video);
                            message.react("✅")
                            await message.reply(`:thumbsup: Added ***${video.title}*** to the queue`)
                            return;
                        }

                        current = video;

                        const stream = await ytdl(video.videoId, { filter: 'audioonly' });

                        resource = createAudioResource(stream, { inlineVolume: true });
                        resource.volume.setVolume(volume);

                        await player.play(resource);
                        connection1.subscribe(player);

                        message.react("✅")
                        await message.reply(`:thumbsup: Now Playing ***${video.title}***`)

                        player.on(AudioPlayerStatus.Idle, async() => {
                            if (loop == "none") {
                                if (queue.length != 0) {
                                    await player.stop()
                                    const newVideo = await videoFinder(queue[0].videoId);
                                    current = queue.shift();
                                    if (newVideo) {
                                        const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                                        resource = createAudioResource(newStream, { inlineVolume: true });
                                        resource.volume.setVolume(volume);
                                        await player.play(resource);
                                        await message.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                                    }
                                } else {
                                    current = null;
                                    await player.stop();
                                }
                            } else if (loop == "song") {
                                await player.stop()
                                const newStream = ytdl(video.videoId, { filter: 'audioonly' });
                                resource = createAudioResource(newStream, { inlineVolume: true });
                                resource.volume.setVolume(volume);
                                await player.play(resource);
                            } else {
                                await player.stop()
                                queue.push(current);
                                current = queue.shift();
                                const newVideo = await videoFinder(queue[0].videoId);
                                if (newVideo) {
                                    const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                                    resource = createAudioResource(newStream, { inlineVolume: true });
                                    resource.volume.setVolume(volume);
                                    await player.play(resource);
                                    await message.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                                }
                            }
                        });

                      player.on('error', error => {
                            console.error(`Error: ${error.message} with song ${current.title} because: ${error.stack}`);
                            message.channel.send(`⛔ ***Error***: Couldn't play ${current.title}.`)
                        });  

                    }
                } else {
                    await message.reply(`⛔ Please enter a valid video url`)
                }

            }
        } else {
            if (message.content.startsWith("https://") || message.content.startsWith("http://")) await message.reply(`⛔ Please enter a valid video url`)
        }

    }

    if (!message.content.startsWith(prefix)) return;
    //checks with the prefix

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case "play":
            if (args.length == 0) return message.reply("Please insert search query!")
            const voiceChannel = message.member.voice.channel;

            if (voiceChannel != null) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                })

                const connection1 = getVoiceConnection(voiceChannel.guild.id);

                const keywords = await args.join(' ')
                const video = await videoFinder(keywords);

                if (video) {

                    if (current != null) {
                        queue.push(video);
                        message.react("✅")
                        await message.reply(`:thumbsup: Added ***${video.title}*** to the queue`)
                        return;
                    }

                    current = video;

                    const stream = await ytdl(video.videoId, { filter: 'audioonly' });

                    resource = createAudioResource(stream, { inlineVolume: true });
                    resource.volume.setVolume(volume);

                    await player.play(resource);
                    connection1.subscribe(player);

                    message.react("✅")
                    await message.reply(`:thumbsup: Now Playing ***${video.title}***`)

                    player.on(AudioPlayerStatus.Idle, async() => {
                        if (loop == "none") {
                            if (queue.length != 0) {
                                await player.stop()
                                const newVideo = await videoFinder(queue[0].videoId);
                                current = queue.shift();
                                if (newVideo) {
                                    const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                                    resource = createAudioResource(newStream, { inlineVolume: true });
                                    resource.volume.setVolume(volume);
                                    await player.play(resource);
                                    await message.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                                }
                            } else {
                                current = null;
                                await player.stop();
                            }
                        } else if (loop == "song") {
                            await player.stop()
                            const newStream = ytdl(video.videoId, { filter: 'audioonly' });
                            resource = createAudioResource(newStream, { inlineVolume: true });
                            resource.volume.setVolume(volume);
                            await player.play(resource);
                        } else {
                            await player.stop()
                            queue.push(current);
                            current = queue.shift();
                            const newVideo = await videoFinder(queue[0].videoId);
                            if (newVideo) {
                                const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                                resource = createAudioResource(newStream, { inlineVolume: true });
                                resource.volume.setVolume(volume);
                                await player.play(resource);
                                await message.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                            }
                        }
                    });

                    player.on('error', error => {
                        console.error(`Error: ${error.message} with song ${current.title} because: ${error.stack}`);
                        message.channel.send(`⛔ ***Error***: Couldn't play ${current.title}.`)
                    });

                } else {
                    message.reply('⛔ No Results Found')
                }
            }
            break;

        case "queue":
            if (current != null) {
                var qu = current.title;
                for (i = 0; i < queue.length; i++) {
                    qu += ", " + queue[i].title;
                }
                message.reply(`${qu}`)
            } else {
                message.reply('⛔ Nothing is being currently played')
            }
            break;

        case "current":
            if (current != null) {
                var crnt = current.title;

                message.reply(`${crnt}`)
            } else {
                message.reply('⛔ Nothing is being currently played')
            }
            break;

        case "stop":
            if (player.state.status != "idle") {
                await message.reply("Stopped music playback!");
                await message.react("✅")
                queue = [];
                player.stop();
            } else {
                message.reply('⛔ Nothing is being currently played')
            }
            break;

        case "loop":
            if (args[0] == "none" || args[0] == "song" || args[0] == "queue") {
                loop = args[0];
                message.reply(`**Loop type set to ${args[0]}**`)
            } else {
                message.reply('Please enter the type of loop you want (none, song, queue)!')
            }
            break;
        case "skip":
            if (player.state.status != "idle") {
                if(loop == "song") loop = "none";
                player.stop();
                await message.channel.send("Skipped song!");
            } else {
                message.reply('⛔ Nothing is being currently played')
            }
            break;

        case "volume":
            if (args.length == 0) return message.reply(`**Volume**: ${volume * 100}`)
            var newVolume = args[0];
            if(isNaN(newVolume)) return message.reply(`Please give a valid numeric value between 1 and 100 to set the volume`)

            if (newVolume > 100 || newVolume < 1) return message.reply(`Please give a value between 1 and 100 to set the volume`)

            volume = newVolume / 100;
            changeConfig({ prefix, volume })
            if (resource != null) resource.volume.setVolume(volume);
            message.reply(`**Volume set to**: ${volume * 100}`)
            break;
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    // const arguments = [];

    // for(let option of interaction.options.data){
    //   if(option.type === 'SUB_COMMAND'){
    //     option.options?.forEach((x) => {
    //       if(x.value) arguments.push(option.value);
    //     });
    //   } else if(option.value) arguments.push(option.value)
    // }
    try {
        await command.execute(client, interaction /*, arguments*/ );
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

exports.getPlayer = function() {
    return player;
}

exports.setPlayer = function(plyr) {
    player = plyr
}

exports.getQueue = function() {
    return queue;
}

exports.setQueue = function(qu) {
    queue = qu
}

exports.getCurrent = function() {
    return current;
}

exports.setCurrent = function(cur) {
    current = cur
}

exports.getloop = function() {
    return loop;
}

exports.setLoop = function(lop) {
    loop = lop
}

exports.getResource = function(){
    return resource;
}

exports.setResource = function(rsc){
    resource = rsc;
}

exports.getVolume = function(){
    return volume;
}

exports.setVolume = function(vlm){
    volume = vlm;
}