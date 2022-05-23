const guildSchema = require("../../schemas/guildSchema")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "volume",
    description: "shows or sets volume of music playback",
    async execute(client, message, args) {
        var embed;
        let guildQueue = client.player.getQueue(message.guild.id);
        switch (true) {
            case (args.length == 0):
                const volume = (await guildSchema.find({guildID: message.guild.id}))[0].guildVolume;
                embed = new MessageEmbed()
                    .setColor("F9A602")
                    .setDescription(`**Volume**: ${volume}`)
                    .setTimestamp()
                message.reply({ embeds: [embed] })
                break;
            case (args.length == 1 && !isNaN(args[0]) && args[0] >= 0 && args[0] <= 100):
                
            case (isNaN(args[0]) || args[0] < 0 || args[0] > 100):
                embed = new MessageEmbed()
                    .setColor("FF0000")
                    .setDescription(`This command is limited to only numbers between 0 and 100, please try again later.`)
                    .setTimestamp()
                message.reply({ embeds: [embed] })
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