const {
    joinVoiceChannel,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');
const request = require(`request`);
const fs = require(`fs`);

module.exports = {
    name: "tts",
    description: "Does tts in vc",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel != null) {
            if (client.player.getQueue(message.guild.id) == null || client.player.getQueue(message.guild.id).isPlaying == false) {
                if (client.ttsPlayer.state.status == "playing") {
                    message.react("❌")
                } else {
                    //var voice = args.shift();
                    let channels = message.mentions.channels;
                    let users = message.mentions.users;
                    let roles = message.mentions.roles;
                    let crosspostedChannels = message.mentions.crosspostedChannels;

                    channels.forEach(channel => {
                        args[args.indexOf(`<#${channel.id}>`)] = `#${channel.name}`
                    })

                    users.forEach(user => {
                        args[args.indexOf(`<@!${user.id}>`)] = `@${user.username}`
                    })

                    roles.forEach(role => {
                        args[args.indexOf(`<@&${role.id}>`)] = `@${role.name}`
                    })

                    crosspostedChannels.forEach(channel => {
                        args[args.indexOf(`<#${channel.channelId}>`)] = `#${channel.name}`
                    })

                    for (i = 0; i < args.length; i++) {
                        if (args[i].includes("<@!") && args[i].includes(">")) {
                            var id = args[i].replace("<@!", "");
                            id = id.replace(">", "")

                            var usr = await client.users.fetch(id).catch((err) => { usr = null });
                            if (usr) args[i] = `@${usr.username}`;
                            else args[i] = `@Unknown User`;
                        } else if (args[i].includes("<#") && args[i].includes(">")) {
                            var id = args[i].replace("<#", "");
                            id = id.replace(">", "")

                            var chnl = await client.channels.fetch(id).catch((err) => { chnl = null });
                            if (chnl) args[i] = `@${chnl.name}`;
                            else args[i] = `#Unknown Channel`;
                        } else if (args[i].includes("<@&") && args[i].includes(">")) {
                            var id = args[i].replace("<@&", "");
                            id = id.replace(">", "")

                            var rol = await client.roles.fetch(id).catch((err) => { rol = null });
                            if (rol) args[i] = `@${rol.name}`;
                            else args[i] = `@Unknown Role`;
                        } else if (args[i].includes("<:") && args[i].includes(">")) {
                            var emojiName = args[i].replace("<:", "");
                            emojiName = emojiName.replace(">", "")
                            emojiName = emojiName.substring(0, emojiName.indexOf(":"))

                            if (emojiName) args[i] = `${emojiName}`;
                            else args[i] = `Unknown Emoji`;
                        } else if (args[i].includes("<a:") && args[i].includes(">")) {
                            var emojiName = args[i].replace("<a:", "");
                            emojiName = emojiName.replace(">", "")
                            emojiName = emojiName.substring(0, emojiName.indexOf(":"))

                            if (emojiName) args[i] = `${emojiName}`;
                            else args[i] = `Unknown Emoji`;
                        }
                    }

                    var text = encodeURIComponent(args.join(' '));
                    var url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${text}`

                    var path = `./tts/${text.slice(0, 20)}_${Date.now()}.ogg`;

                    request.get(url)
                        .on('error', (e) => console.error(e))
                        .pipe(fs.createWriteStream(path).on('finish', () => playtts(voiceChannel, path)));
                }
            } else {
                await message.reply(`⛔ Cannot play a tts message while playing music`)
            }
        } else {
            await message.reply(`⛔ You must be in a voice channel to play a tts message`)
        }

        async function playtts(voiceChannel, path) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            })

            const connection1 = getVoiceConnection(voiceChannel.guild.id);
            var resource = createAudioResource(path, { inlineVolume: true });
            resource.volume.setVolume(client.volume / 100);
            await client.ttsPlayer.play(resource);
            connection1.subscribe(client.ttsPlayer);

            message.react("✅")
            client.ttsPlayer.on(AudioPlayerStatus.Idle, async() => {
                if (fs.existsSync(path) && client.ttsPlayer.state.status != "playing") fs.unlinkSync(path)
            });

            client.ttsPlayer.on('error', error => {
                console.error(`Error: ${error.message} with song ${path} because: ${error.stack}`);
                message.channel.send(`⛔ ***Error***: Couldn't play ${path}.`)
            });
        }
    }
}