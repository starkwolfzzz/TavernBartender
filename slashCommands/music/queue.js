const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "queue",
    description: "Shows current music queue",
    options: [{
        name: "page",
        description: "The page of the queue to show",
        type: "INTEGER"
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        page = options.getInteger("page");

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

        try {

            var embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`🎶 Current Queue | ${queue.songs.length} Songs - \`${queue.formattedDuration}\``)

            var numPages = Math.ceil(queue.songs.length / 10)
            var q = "";

            if (!page || page > numPages || page == 1 || page <= 0) {
                for (i = 0; i < 10; i++) {
                    if (i == 0) q += `**Playing:** \`${queue.songs[i].name}\` - \`${queue.songs[i].formattedDuration}\` (Requested by ${queue.songs[i].user})\n`
                    else {
                        if (queue.songs[i]) q += `**[${i}]:** \`${queue.songs[i].name}\` - \`${queue.songs[i].formattedDuration}\` (Requested by ${queue.songs[i].user})\n`
                        else break;
                    }
                }

                embed.setDescription(q);
                embed.setFooter({ text: `Page 1/${numPages}` })
            } else if (page > 1) {
                for (i = (0 + (10 * (page - 1))); i < (10 + (10 * (page - 1))); i++) {
                    if (queue.songs[i]) q += `**[${i}]:** \`${queue.songs[i].name}\` - \`${queue.songs[i].formattedDuration}\` (Requested by ${queue.songs[i].user})\n`
                    else break;
                }

                embed.setDescription(q);
                embed.setFooter({ text: `Page ${page}/${numPages}` })
            }

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