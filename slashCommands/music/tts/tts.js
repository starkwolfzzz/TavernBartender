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
    description: "/tts {voice} {text}",
    options: [{
            name: "voice",
            description: "The voice to use with the tts",
            type: "STRING",
            choices: [{
                    name: "Amy",
                    value: "Amy"
                },
                {
                    name: "Brian",
                    value: "Brian"
                },
                {
                    name: "Hoda",
                    value: "Hoda"
                }
            ],
            required: true
        },
        {
            name: "text",
            description: "The text to play as tts",
            type: "STRING",
            required: true
        },
    ],
    async execute(client, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (voiceChannel != null) {
            if (client.player.getQueue(interaction.guild.id) == null || client.player.getQueue(interaction.guild.id).isPlaying == false) {
                if (client.ttsPlayer.state.status == "playing") {
                    await interaction.reply(`⛔ Cannot play a tts message while already playing one`)
                } else {
                    var voice = interaction.options.getString('voice');

                    const message = interaction.options.getString('text');
                    const args = message.split(/ +/);
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

                            var rol = await interaction.guild.roles.fetch(id).catch((err) => { rol = null });
                            if (rol) args[i] = `@${rol.name}`;
                            else args[i] = `@Unknown Role`;
                        } else if (args[i].includes("<:") && args[i].includes(">")) {
                            var emojiName = args[i].replace("<:", "");
                            emojiName = emojiName.replace(">", "")
                            emojiName = emojiName.substring(0, emojiName.indexOf(":"))

                            if (emojiName) args[i] = `${emojiName}`;
                            else args[i] = `Unknown Emoji`;
                        } else if (args[i].includes("<1:") && args[i].includes(">")) {
                            var emojiName = args[i].replace("<a:", "");
                            emojiName = emojiName.replace(">", "")
                            emojiName = emojiName.substring(0, emojiName.indexOf(":"))

                            if (emojiName) args[i] = `${emojiName}`;
                            else args[i] = `Unknown Emoji`;
                        }
                    }

                    var text = encodeURIComponent(args.join(' '));
                    var url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${text}`

                    var path = `./tts/${text.slice(0, 20)}_${Date.now()}.ogg`;

                    request.get(url)
                        .on('error', (e) => console.error(e))
                        .pipe(fs.createWriteStream(path).on('finish', () => playtts(voiceChannel, path, text)));
                }
            } else {
                await interaction.reply(`⛔ Cannot play a tts message while playing music`)
            }
        } else {
            await interaction.reply(`⛔ You must be in a voice channel to play a tts message`)
        }

        async function playtts(voiceChannel, path, text) {
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

            await interaction.reply({ content: `Saying ${decodeURIComponent(text).replace("@everyone", "@ everyone")}...` })

            client.ttsPlayer.on(AudioPlayerStatus.Idle, async() => {
                if (fs.existsSync(path) && client.ttsPlayer.state.status != "playing") fs.unlinkSync(path)
                interaction.editReply(`✅ Said ***${decodeURIComponent(text).replace("@everyone", "@ everyone")}***`)
                    // const message = await interaction.fetchReply();
                    // message.delete()
            });

            client.ttsPlayer.on('error', error => {
                console.error(`Error: ${error.message} with song ${path} because: ${error.stack}`);
                interaction.editReply(`⛔ ***Error***: Couldn't play ${path}.`)
            });
        }
    }
}