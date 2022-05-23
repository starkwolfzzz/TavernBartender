const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "skip",
    description: "Skip a song",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { member, guild, channel } = interaction;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in a voice channel to use music commands.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in my current voice channel to do that.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | There is nothing playing.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (queue.songs.length <= 1 && !queue.autoplay) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | There are no queued songs to skip to.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            var song = queue.songs[0];
            var user = client.guilds.cache.get(queue.voiceChannel.guildId).members.cache.get(song.user.id).user;
            await queue.skip(voiceChannel);
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor({ name: `Requested by: ${user.username}#${user.discriminator}`, iconURL: user.avatarURL() })
                .setURL(song.url)
                .setTitle(`Skipped: ${song.name}`)
                .setDescription(`⏩ | \`${song.name}\` has been skipped.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `${member.user.username}#${member.user.discriminator}`, iconURL: member.avatarURL()})
                .setTimestamp()

            return interaction.reply({ embeds: [embed] })

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}