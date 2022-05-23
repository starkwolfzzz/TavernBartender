const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: "play",
    description: "Plays music",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (args.length == 0) return message.reply("Please insert search query!")
        const voiceChannel = message.member.voice.channel;
        var isYt = false;
        if((message.content.includes("youtu"))) isYt = true;

        if (voiceChannel != null) {
            if (args.join(' ').includes("https") || args.join(' ').includes("http")) {
                if (args.join(' ').includes("&list=") || args.join(' ').includes("playlist")) {
                    let queue = client.player.createQueue(message.guild.id);
                    queue.setData({ channel: message.channel })
                    await queue.join(voiceChannel);
                    let song = await queue.playlist(args.join(' ')).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });

                    queue.setVolume((await guildSchema.find({guildID: message.guild.id}))[0].guildVolume)

                    // if (guildQueue == null || guildQueue.nowPlaying == song) await message.reply(`:thumbsup: Now Playing ***${song.name}***`)
                    // else await message.reply(`:thumbsup: Added ***${song.name}*** to the queue`)
                    message.react("✅")
                } else if (args.join(' ').includes("album")) {
                    await message.reply(`⛔ Cannot play spotify albums`)
                } else {
                    var playMsg = args[0];
                    if (isYt) {
                        const current_url = new URL(playMsg);
                        const search_params = current_url.searchParams;
                        playMsg = search_params.get('v')
                    }

                    let queue = client.player.createQueue(message.guild.id);
                    queue.setData({ channel: message.channel })
                    await queue.join(voiceChannel);
                    let song = await queue.play(playMsg).catch(_ => {
                        if (!guildQueue)
                            queue.stop();
                    });

                    queue.setVolume((await guildSchema.find({guildID: message.guild.id}))[0].guildVolume)

                    // if (guildQueue == null || guildQueue.nowPlaying == song) await message.reply(`:thumbsup: Now Playing ***${song.name}***`)
                    // else await message.reply(`:thumbsup: Added ***${song.name}*** to the queue`)
                    message.react("✅")
                }
            } else {
                let queue = client.player.createQueue(message.guild.id);
                queue.setData({ channel: message.channel })
                await queue.join(voiceChannel);
                let song = await queue.play(args.join(' ')).catch(_ => {
                    if (!guildQueue)
                        queue.stop();
                });

                queue.setVolume((await guildSchema.find({guildID: message.guild.id}))[0].guildVolume)

                // if (guildQueue == null || guildQueue.nowPlaying == song) await message.reply(`:thumbsup: Now Playing ***${song.name}***`)
                // else await message.reply(`:thumbsup: Added ***${song.name}*** to the queue`)
                message.react("✅")
            }
        } else {
            await message.reply(`⛔ You must be in a voice channel to play music`)
        }
    }
}