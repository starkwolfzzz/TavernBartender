const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "seek",
    description: "Seek to a specific part of the song",
    options: [{
        name: "time",
        description: "The time (in seconds) to seek to",
        type: "INTEGER",
        required: true,
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

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

        const time = options.getInteger("time");

        if (time < 0) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Time to seek to must be 0 seconds or higher.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (time > queue.songs[0].duration) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Time to seek to must be within the duration of the current song.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            await queue.seek(time);
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | Sought to ${time} seconds of the current song.`)

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