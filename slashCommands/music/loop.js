const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "loop",
    description: "Get or set music loop",
    options: [{
        name: "type",
        description: "The type of the loop to use on the music",
        type: "STRING",
        choices: [{
                name: "None",
                value: "none"
            },
            {
                name: "Song",
                value: "song"
            },
            {
                name: "Queue",
                value: "queue"
            }
        ]
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        loop = options.getString("type");

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

        if (!interaction.options.getString("type")) {
            var embed = new MessageEmbed()
                .setColor("BLUE")
                .setDescription(`🔁 | Current loop type set to: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'None'}\``)
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        try {

            switch (interaction.options.getString("type")) {
                case "none":
                    await queue.setRepeatMode(0);
                    break;
                case "song":
                    await queue.setRepeatMode(1);
                    break;
                case "queue":
                    await queue.setRepeatMode(2);
                    break;
            }

            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | Set loop type to: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'None'}\``)

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