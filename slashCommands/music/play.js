const { CommandInteraction, MessageEmbed, Client } = require('discord.js')
const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: "play",
    description: "Play a song or playlist",
    options: [{
        name: "query",
        description: "Provide a name or URL for the song or playlist",
        type: "STRING",
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

        if (!voiceChannel) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in a voice channel to use music commands.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | I'm already playing music in <#${guild.me.voice.channelId}>.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            interaction.reply({ content: `☑️ | Adding ${options.getString("query")} to the queue.`, ephemeral: true })
            client.distube.play(voiceChannel, options.getString("query"), { textChannel: channel, member: member }).then(async () => {
                (await client.distube.setVolume(guild.id, parseInt((await guildSchema.find({guildID: guild.id}))[0].guildVolume)))
            }).catch((e) => {
                var errorEmbed = new MessageEmbed()
                  .setColor("RED")
                  .setDescription(
                    `❌ | An Unexpected Error Occured: ${e
                      .toString()
                      .slice(0, 4000)}`
                  );

                console.log(e);
                return message.reply({ embeds: [errorEmbed] });
              });

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }
    }
}