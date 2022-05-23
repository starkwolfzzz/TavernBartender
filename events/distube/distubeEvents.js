const client = require('../../index')
const { MessageEmbed } = require('discord.js');
const guildSchema = require('../../schemas/guildSchema')

const status = async queue => 
    `Volume: \`${(await guildSchema.find({guildID: queue.voiceChannel.guildId}))[0].guildVolume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'None'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
    .on('playSong', async (queue, song) => {
        var user = client.guilds.cache.get(queue.voiceChannel.guildId).members.cache.get(song.user.id).user;
        var embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: `Requested by: ${user.username}#${user.discriminator}`, iconURL: user.avatarURL() })
            .setURL(song.url)
            .setTitle(`Playing: ${song.name}`)
            .setDescription(`▶️ | Playing \`${song.name}\` - \`${song.formattedDuration}\`\n${await status(queue)}`)
            .setImage(song.thumbnail)
            //.setFooter({ text: `${song.uploader.name}`, iconURL: `${song.thumbnail}` })
            //.setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on('addSong', (queue, song) => {
        var user = client.guilds.cache.get(queue.voiceChannel.guildId).members.cache.get(song.user.id).user;
        var embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({ name: `Requested by: ${user.username}#${user.discriminator}`, iconURL: user.avatarURL() })
            .setURL(song.url)
            .setTitle(`Added to Queue: ${song.name}`)
            .setDescription(`☑️ | Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue.`)
            .setImage(song.thumbnail)
            //.setFooter({ text: `${song.uploader.name}`, iconURL: `${song.thumbnail}` })
            //.setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on('addList', (queue, playlist) => {
        var user = client.guilds.cache.get(queue.voiceChannel.guildId).members.cache.get(playlist.user.id).user;
        var embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({ name: `Requested by: ${user.username}#${user.discriminator}`, iconURL: user.avatarURL() })
            .setURL(playlist.url)
            .setTitle(`Added Playlist to Queue: ${playlist.name}`)
            .setDescription(`☑️ | Added \`${playlist.name}\` playlist to queue`)
            .setImage(playlist.thumbnail)
            //.setFooter({ text: `${playlist.uploader.name}`, iconURL: `${playlist.thumbnail}` })
            //.setTimestamp()
        queue.textChannel.send({ embeds: [embed] })
    })
    .on('error', (channel, e) => {
        var embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)
        channel.send({ embeds: [embed] })
        console.error(e)
    })
    .on('empty', channel => {
        var embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`⛔ | I left the voice channel as it has been empty for more than 5 minutes.`)
        console.log(channel)
        channel.send({ embeds: [embed] })
    })
    .on('searchNoResult', (message, query) => {
        var embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | No result found for \`${query}\`!`)
        message.channel.send({ embeds: [embed] })
    })
    .on('noRelated', (queue) => {
        var embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | Couldn't find related videos to play.`)
        queue.textChannel.send({ embeds: [embed] })
    })
    .on('finish', queue => {})