const { CommandInteraction, MessageEmbed, Client } = require('discord.js')
const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: "playchanneltype",
    description: "Get or set the type of the handling of the 'play' channel",
    options: [{
        name: "type",
        description: "Provide a type to change the handling of the 'play' channel to.",
        type: "STRING",
        choices: [{
                name: "None",
                value: "NONE"
            },
            {
                name: "Recognize and play only URLs on the 'play' channel",
                value: "URL"
            },
            {
                name: "Recognize and play URLs and messages as query on the 'play' channel",
                value: "ALL"
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

        try {

            var newType = options.getString("type");
            embed = new MessageEmbed()
                .setColor("GREEN")
                .setTimestamp()

            var type;

            type = (await guildSchema.find({guildID: guild.id}))[0].guildPlayChannelType;

            switch(type){
                case "URL":
                    type = "Recognize and play only URLs on the 'play' channel";
                    break;
                case "ALL":
                    type = "Recognize and play URLs and messages as query on the 'play' channel";
                    break;
            }

            if (!newType) {
                embed.setColor("BLUE")
                embed.setDescription(`🔊 | Type set to: \`${type}\`.`)
                return interaction.reply({ embeds: [embed] })
            }

            switch(newType){
                case "URL":
                    newType = "Recognize and play only URLs on the 'play' channel";
                    break;
                case "ALL":
                    newType = "Recognize and play URLs and messages as query on the 'play' channel";
                    break;
            }

            embed.setDescription(`☑️ | Set type to: \`${newType}\`.`)

            switch(newType){
                case "Recognize and play only URLs on the 'play' channel":
                    newType = "URL";
                    break;
                case "Recognize and play URLs and messages as query on the 'play' channel":
                    newType = "ALL";
                    break;
            }

            await guildSchema.updateOne({
                guildID: guild.id
            }, {
                guildPlayChannelType: newType
            }).then(async () => {
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