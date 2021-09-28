const {
    joinVoiceChannel,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
    AudioPlayerStatus,
    createAudioPlayer,
    getVoiceConnection
} = require('@discordjs/voice');

var index = require('../index.js')

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

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
        interaction.reply({ content: `Searching youtube for ${interaction.options.getString('keywords')}...` })
        const message = await interaction.fetchReply();
        const voiceChannel = interaction.member.voice.channel;

        if (voiceChannel != null) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            })

            const connection1 = getVoiceConnection(voiceChannel.guild.id);

            const videoFinder = async(query) => {
                const videoResult = await ytSearch(query);

                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

            }

            const keywords = await interaction.options.getString('keywords')
            const video = await videoFinder(keywords);

            if (video) {

                if (index.getCurrent() != null) {
                    var que = [];
                    if (index.getQueue() != null) que = index.getQueue()
                    que.push(video);
                    index.setQueue(que);
                    await interaction.editReply(`:thumbsup: Added ***${video.title}*** to the queue`)
                    return;
                }

                index.setCurrent(video);

                const stream = await ytdl(video.videoId, { filter: 'audioonly' });

                var resource = createAudioResource(stream, { inlineVolume: true });
                resource.volume.setVolume(index.getVolume());

                index.setResource(resource);

                var plr = index.getPlayer();
                plr.play(index.getResource())

                await index.setPlayer(plr);
                connection1.subscribe(index.getPlayer());

                var loop = index.getloop();
                var queue = index.getQueue();

                plr.on(AudioPlayerStatus.Idle, async() => {
                    if (loop == "none") {
                        if (index.getQueue().length != 0) {
                            var player = index.getPlayer();
                            await player.stop()
                            index.setPlayer(player);
                            var queu = index.getQueue();
                            const newVideo = await videoFinder(queu[0].videoId);
                            index.setCurrent(queu.shift());
                            index.setQueue(queu)
                            if (newVideo) {
                                const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                                resource = createAudioResource(newStream, { inlineVolume: true });
                                resource.volume.setVolume(index.getVolume());
                                await player.play(resource);
                                index.setPlayer(player);
                                index.setResource(resource);
                                await interaction.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                            }
                        } else {
                            index.setCurrent(null);
                            var player = index.getPlayer();
                            await player.stop();
                            index.setPlayer(player);
                        }
                    } else if (loop == "song") {
                        var player = index.getPlayer();
                        await player.stop()
                        index.setPlayer(player);
                        const newStream = ytdl(video.videoId, { filter: 'audioonly' });
                        resource = createAudioResource(stream, { inlineVolume: true });
                        resource.volume.setVolume(index.getVolume());

                        await player.play(resource);
                        index.setPlayer(player);
                        index.setResource(resource);
                    } else {
                        var player = index.getPlayer();
                        await player.stop();
                        index.setPlayer(player);

                        var queu = index.getQueue();
                        queu.push(index.getCurrent());
                        index.setCurrent(queue.shift());
                        index.setQueue(queu);
                        const newVideo = await videoFinder(queu[0].videoId);
                        if (newVideo) {
                            const newStream = ytdl(newVideo.videoId, { filter: 'audioonly' });
                            resource = createAudioResource(newStream, { inlineVolume: true });
                            resource.volume.setVolume(index.getVolume());
                            await player.play(resource);
                            index.setPlayer(player);
                            index.setResource(resource);
                            await interaction.channel.send(`:thumbsup: Now Playing ***${newVideo.title}***`)
                        }
                    }
                });

                plr.on('error', error => {
                    console.error(`Error: ${error.message} with song ${index.getCurrent().title} because: ${error.stack}`);
                    interaction.channel.send(`⛔ ***Error***: Couldn't play ${index.getCurrent().title}.`)
                });

                await interaction.editReply({ content: `:thumbsup: Now Playing ***${video.title}***` })
            } else {
                interaction.editReply({ content: 'No Results Found' })
            }
        }
    }
}