const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "stop",
    description: "Stop music playback",
    options: [{
        name: "time",
        description: "The time to stop the queue after (in seconds)",
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
        const time = options.getInteger(`time`);

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

        if (time && time <= 0) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | Time to stop after has to be above 0 seconds.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            if (time) {
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | The queue will be stopped in \`${time}\` seconds.`)

                interaction.reply({ embeds: [embed] })
                setTimeout(async() => {
                    await queue.stop(voiceChannel);
                    var embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`☑️ | The queue has been stopped as requested by ${member} \`${time}\` seconds ago.`)

                    return channel.send({ embeds: [embed] })
                }, time * 1000);
            } else {
                await queue.stop(voiceChannel);
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | The queue has been stopped.`)

                return interaction.reply({ embeds: [embed] })
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