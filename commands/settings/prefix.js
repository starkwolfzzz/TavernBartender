const guildSchema = require("../../schemas/guildSchema")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "prefix",
    description: "Shows or sets the current server prefix",
    async execute(client, message, args) {
        var embed;
        switch (true) {
            case (args.length == 0):
                const searchById = guildSchema.find({
                    guildID: message.guild.id,
                })

                var prefix = (await searchById)[0].guildPrefix;

                embed = new MessageEmbed()
                    .setColor("F9A602")
                    .setDescription(`Server Prefix is: **${prefix}**`)
                    .setTimestamp()
                message.reply({ embeds: [embed] })
                break;
            case (args.length == 1):
                const newPrefix = args[0];
                embed = new MessageEmbed()
                    .setColor("00FF00")
                    .setDescription(`Server Prefix has been changed to **${newPrefix}**`)
                    .setTimestamp()

                if (newPrefix.length > 5) {
                    embed.setColor("FF0000")
                    embed.setDescription(`Couldn't change server prefix to **${newPrefix}** as it has to be shorter than 5 characters.`)
                    message.reply({ embeds: [embed] })
                } else {
                    await guildSchema.updateOne({
                        guildID: message.guild.id
                    }, {
                        guildPrefix: newPrefix
                    }).then(() => {
                        message.reply({ embeds: [embed] })
                    }).catch((err) => {
                        if (err) console.log(err);
                        embed.setColor("FF0000")
                        embed.setDescription(`Couldn't change server prefix to **${newPrefix}**`)
                        message.reply({ embeds: [embed] })
                    })
                }
                break;
            case (args.length >= 2):
                embed = new MessageEmbed()
                .setColor("FF0000")
                .setDescription(`This command is limited to only one argument, please try again later.`)
                .setTimestamp()
                message.reply({ embeds: [embed] })
                break;
        }
    }
}