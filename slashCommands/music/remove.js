const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "remove",
    description: "Remove a specific song from the queue",
    options: [{
        name: "index",
        description: "The index of the song to remove from the queue (get infex from /queue)",
        type: "INTEGER",
        required: true
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        const voiceChannel = member.voice.channel;
        const index = options.getInteger("index");

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

        if (index <= 0) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Index of song to remove has to be above 0.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        } else if(index >= queue.songs.length){
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Index of song to remove has to be within current queue's length.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            const song = queue.songs[index];
            queue.songs.splice(index, 1);
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | \`${song.name}\` has been removed from the queue.`)

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