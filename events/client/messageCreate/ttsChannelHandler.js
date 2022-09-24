require('dotenv').config();

const {
    joinVoiceChannel,
    createAudioResource,
    AudioPlayerStatus,
    getVoiceConnection
} = require('@discordjs/voice');
const request = require(`request`);

const fs = require('fs');
const guildSchema = require("../../../schemas/guildSchema")

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        if (message.channel.type === "DM") return;

        const searchById = guildSchema.find({
            guildID: message.guild.id
        })

        var prefix = (await searchById)[0].guildPrefix;

        if (message.content.startsWith(prefix)) return;

        var args;
        var voiceChannel;

        switch (message.channel.name) {
            case "tts":
                args = message.content.split(/ +/);
                voiceChannel = message.member.voice.channel;
                if (voiceChannel != null) {
                    if (client.distube.getQueue(message.guild.id) == null || client.distube.getQueue(message.guild.id).isPlaying == false) {
                        if (client.ttsPlayer.state.status == "playing") {
                            message.react("❌")
                        } else {
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
                    resource.volume.setVolume((await guildSchema.find({ guildID: message.guild.id }))[0].guildVolume / 100);
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
                break;
                /*case "tips-tts":
					args = message.content.split(/ +/);
					voiceChannel = message.member.voice.channel;
					if (voiceChannel != null) {
						if (client.player.getQueue(message.guild.id) == null) {
							if (client.ttsPlayer.state.status == "playing") {
								message.react("❌")
							} else {
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
								var url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${text}`
	
								var path = `./tts/${text.slice(0, 20)}_${Date.now()}.ogg`;
	
								request.get(url)
									.on('error', (e) => console.error(e))
									.pipe(fs.createWriteStream(path).on('finish', () => playtipstts(voiceChannel, path)));
							}
						} else {
							await message.reply(`⛔ Cannot play a tts message while playing music`)
						}
					} else {
						await message.reply(`⛔ You must be in a voice channel to play a tts message`)
					}
	
					async function playtipstts(voiceChannel, path) {
						const connection = joinVoiceChannel({
							channelId: voiceChannel.id,
							guildId: voiceChannel.guild.id,
							adapterCreator: voiceChannel.guild.voiceAdapterCreator
						})
	
						const connection1 = getVoiceConnection(voiceChannel.guild.id);
						var resource = createAudioResource(path, { inlineVolume: true });
						resource.volume.setVolume((await guildSchema.find({guildID: message.guild.id}))[0].guildVolume / 100);
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
					break;*/
        }
    },
};