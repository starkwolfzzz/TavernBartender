const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "autoplay",
    description: "Get or set autoplay",
    options: [{
        name: "toggle",
        description: "Toggle autoplay state",
        type: "STRING",
        choices: [{
                name: "Toggle",
                value: "toggle"
            },
        ]
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

        if(!options.getString("toggle")){
            var embed = new MessageEmbed()
                .setColor("BLUE")
                .setDescription(`☑️ | Autoplay set to: \`${queue.autoplay ? 'On' : 'Off'}\``)

            return interaction.reply({ embeds: [embed] })
        }

        try {

            const autoplay = queue.toggleAutoplay();
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | Set Autoplay to: \`${autoplay ? 'On' : 'Off'}\``)

            interaction.reply({ embeds: [embed] })

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}