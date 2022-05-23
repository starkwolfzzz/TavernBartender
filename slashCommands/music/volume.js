const { CommandInteraction, MessageEmbed, Client } = require('discord.js')
const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: "volume",
    description: "Get or set volume of the song",
    options: [{
        name: "volume",
        description: "Provide a number between 0 and 100 to set the volume to.",
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

        try {

            const newVolume = options.getInteger("volume");
            embed = new MessageEmbed()
                .setColor("GREEN")
                .setTimestamp()

            var volume;

            if(!queue) volume = (await guildSchema.find({guildID: guild.id}))[0].guildVolume;
            else volume = queue.volume;

            if (!newVolume) {
                embed.setColor("BLUE")
                embed.setDescription(`🔊 | Volume set to: \`${volume}%\``)
                return interaction.reply({ embeds: [embed] })
            }

            embed.setDescription(`☑️ | Set volume to: \`${newVolume}%\``)
            await guildSchema.updateOne({
                guildID: guild.id
            }, {
                guildVolume: newVolume
            }).then(async () => {
                if (newVolume > 100 || newVolume < 0) {
                    var errorEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`❌ | Couldn't set volume to \`${newVolume}%\` as volume value must be between 0 and 100`)

                    return interaction.reply({ embeds: [errorEmbed] })
                }

                if (queue) await queue.setVolume(newVolume);
                return interaction.reply({ embeds: [embed] })
            }).catch((err) => {
                if (err) console.log(err);
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | An Unexpected Error Occured: ${err.toString().slice(0, 4000)}`)

                return interaction.reply({ embeds: [errorEmbed] })
            })

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}