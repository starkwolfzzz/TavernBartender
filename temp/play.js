const {
    joinVoiceChannel,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');

var index = require('../../index.js')

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: "play",
    description: "Plays music",
    options: [{
        name: "keywords",
        description: "The keywords used in the search",
        type: "STRING",
        required: true
    }],
    async execute(client, interaction) {
        await interaction.reply({ content: `Searching for ${interaction.options.getString("keywords")}...` })
        let guildQueue = client.player.getQueue(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        var isYt = false;
        if ((interaction.options.getString("keywords").includes("youtu"))) isYt = true;

        if (voiceChannel != null) {
            if (interaction.options.getString("keywords").includes("https") || interaction.options.getString("keywords").includes("http")) {
                if (interaction.options.getString("keywords").includes("&list=") || interaction.options.getString("keywords").includes("playlist")) {
                    let queue = client.player.createQueue(interaction.guild.id);
                    queue.setData({ channel: interaction.channel })
                    await queue.join(voiceChannel);
                    let song = await queue.playlist(interaction.options.getString("keywords")).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });

                    queue.setVolume((await guildSchema.find({guildID: interaction.guild.id,}))[0].guildVolume)

                    // if (guildQueue == null || guildQueue.nowPlaying == song) await interaction.editReply({ content : `:thumbsup: Now Playing ***${song.name}***` })
                    // else await interaction.editReply({ content : `:thumbsup: Added ***${song.name}*** to the queue` })
                } else if (interaction.options.getString("keywords").includes("album")) {
                    await message.reply(`⛔ Cannot play spotify albums`)
                } else {
                    var playMsg = interaction.options.getString("keywords");
                    if (isYt) {
                        const current_url = new URL(playMsg);
                        const search_params = current_url.searchParams;
                        playMsg = search_params.get('v')
                    }

                    let queue = client.player.createQueue(interaction.guild.id);
                    queue.setData({ channel: interaction.channel })
                    await queue.join(voiceChannel);
                    let song = await queue.play(playMsg).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });

                    queue.setVolume((await guildSchema.find({guildID: interaction.guild.id,}))[0].guildVolume)

                    // if (guildQueue == null || guildQueue.nowPlaying == song) await interaction.editReply({ content : `:thumbsup: Now Playing ***${song.name}***` })
                    // else await interaction.editReply({ content : `:thumbsup: Added ***${song.name}*** to the queue` })
                }
            } else {
                let queue = client.player.createQueue(interaction.guild.id);
                queue.setData({ channel: interaction.channel })
                await queue.join(voiceChannel);
                let song = await queue.play(interaction.options.getString("keywords")).catch(_ => {
                    if (!guildQueue)
                        queue.stop();
                });

                queue.setVolume((await guildSchema.find({guildID: interaction.guild.id,}))[0].guildVolume)

                // if (guildQueue == null || guildQueue.nowPlaying == song) await interaction.editReply({ content : `:thumbsup: Now Playing ***${song.name}***` })
                // else await interaction.editReply({ content : `:thumbsup: Added ***${song.name}*** to the queue` })
            }
        } else {
            await interaction.editReply({ content: `⛔ You must be in a voice channel to play music` })
        }
    }
}