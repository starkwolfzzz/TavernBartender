const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "filters",
    description: "Get or set music filters",
    options: [{
        name: "filter",
        description: "Filter to add",
        type: "STRING",
        choices: [{ name: "3D", value: "3d" },
            { name: "Bass Boost", value: "bassboost" },
            { name: "Echo", value: "echo" },
            { name: "Karaoke", value: "karaoke" },
            { name: "Nightcore", value: "nightcore" },
            { name: "Vaporwave", value: "vaporwave" },
            { name: "Flanger", value: "flanger" },
            { name: "Gate", value: "gate" },
            { name: "Haas", value: "haas" },
            { name: "Reverse", value: "reverse" },
            { name: "Surround", value: "surround" },
            { name: "Mcompand", value: "mcompand" },
            { name: "Phaser", value: "phaser" },
            { name: "Tremolo", value: "tremolo" },
            { name: "Earwax", value: "earwax" },
            { name: "Off", value: "off" },
            
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

        if (!options.getString("filter")) {
            var embed = new MessageEmbed()
                .setColor("BLUE")
                .setDescription(`☑️ | Current Queue Filters: \`${queue.filters.join(', ') || 'Off'}\``)

            return interaction.reply({ embeds: [embed] })
        }

        try {

            if(options.getString("filter") != "off"){
                queue.setFilter(options.getString("filter"))
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | Added Queue Filter: \`${options.getString("filter")}\``)
    
                interaction.reply({ embeds: [embed] })
            } else {
                queue.setFilter(false)
                var embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`☑️ | Disabled all current queue filters.`)
    
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