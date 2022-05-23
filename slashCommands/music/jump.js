const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "jump",
    description: "Jump to a song in the queue",
    options: [{
        name: "to",
        description: "Number of song to jump to (The next one is 1, 2,... The previous one is -1, -2,...)",
        type: "INTEGER"
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

        const index = options.getInteger("to");
        if (index === 0) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Cannot jump to current song.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (index < 0 && !queue.previousSongs[Math.abs(index) - 1]) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Song #${index} doesn't exist.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        } else if (index > 0 && !queue.songs[index]) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Song #${index} doesn't exist.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            await queue.jump(index);
            return interaction.reply({ content: `☑️ | Jumped to song #${index}`})

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}