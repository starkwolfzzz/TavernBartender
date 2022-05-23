const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "leave",
    description: "Make the bot leave its current voice channel",
    permissions: "ADMINISTRATOR",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        const voiceChannel = guild.members.cache.find(mmbr => mmbr.id === client.user.id).voice.channel;
        console.log(voiceChannel)

        if (!voiceChannel) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | I'm not currently connected to any voice channels.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            await client.distube.voices.leave(voiceChannel.guild);
            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`☑️ | Left <#${voiceChannel.id}>`)

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