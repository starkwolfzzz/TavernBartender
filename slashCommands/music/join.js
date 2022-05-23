const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "join",
    description: "Make the bot join a voice channel",
    options: [{
        name: "channelid",
        description: "The voice channel's id",
        type: "STRING",
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        if (options.getString("channelid")) {
            if (!client.guilds.cache.get(interaction.guildId).channels.cache.find(ch => ch.id === options.getString("channelid") && ch.type === "GUILD_VOICE")) {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | \`${options.getString("channelid")}\` is not a valid id of a voice channel in this guild.`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        }

        const voiceChannel = client.guilds.cache.get(interaction.guildId).channels.cache.find(ch => ch.id === options.getString("channelid") && ch.type === "GUILD_VOICE") || member.voice.channel;

        if (!voiceChannel) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in a voice channel or enter a voice channel id.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (guild.me.voice.channelId) {
            if (guild.me.voice.channelId == voiceChannel.id) {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | I'm already connected to <#${voiceChannel.id}>`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            } else {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | Sorry I can't join <#${voiceChannel.id}>, I'm currently connected to <#${guild.me.voice.channelId}>`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        }

        try {

            await client.distube.voices.join(voiceChannel);
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | Joined <#${voiceChannel.id}>`)

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