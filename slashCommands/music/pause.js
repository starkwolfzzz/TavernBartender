const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "pause",
    description: "Pause music playback",
    options: [{
        name: "time",
        description: "The time (in seconds) to pause the music for",
        type: "INTEGER",
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

        if (queue.paused) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Music playback is already paused.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            if (options.getInteger("time") && options.getInteger("time") > 0) {
                var time = options.getInteger("time")
                await queue.pause();
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | The queue has been paused for ${time} seconds.`)

                interaction.reply({ embeds: [embed] })

                setTimeout(async () => {
                    await queue.resume();
                    embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`☑️ | The queue has been resumed.`)

                    interaction.channel.send({ embeds: [embed] })
                }, time * 1000)
            } else if (options.getInteger("time") < 0) {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | Time to pause for must be higher than 0 seconds.`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            } else {
                await queue.pause();
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | The queue has been paused.`)

                interaction.reply({ embeds: [embed] })
            }

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}