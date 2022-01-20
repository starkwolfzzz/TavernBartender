const guildSchema = require("../../schemas/guildSchema")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "volume",
    description: "shows or sets volume of music playback",
    async execute(client, message, args) {
        /*const index = require("../../index.js");
        
        let guildQueue = client.player.getQueue(message.guild.id);
        if (args.length == 0) return message.reply(`**Volume**: ${client.volume}`)
        var newVolume = args[0];
        if (isNaN(newVolume)) return message.reply(`Please give a valid numeric value between 1 and 100 to set the volume`)

        if (newVolume > 100 || newVolume < 1) return message.reply(`Please give a value between 1 and 100 to set the volume`)

        client.volume = newVolume;
        index.changeCfg(client.prefix, client.volume);
        if (guildQueue != null) guildQueue.setVolume(client.volume);
        message.reply(`**Volume set to**: ${client.volume}`)*/

        var embed;
        switch (true) {
            case (args.length == 0):
                const searchById = guildSchema.find({
                    guildID: message.guild.id,
                })

                var volume = (await searchById)[0].guildVolume;

                embed = new MessageEmbed()
                    .setColor("F9A602")
                    .setDescription(`**Volume**: ${volume}`)
                    .setTimestamp()
                message.reply({ embeds: [embed] })
                break;
            case (args.length == 1 && !isNaN(args[0]) && args[0] >= 0 && args[0] <= 100):
                const newVolume = args[0];
                embed = new MessageEmbed()
                    .setColor("00FF00")
                    .setDescription(`**Volume set to**: ${newVolume}`)
                    .setTimestamp()

                await guildSchema.updateOne({
                    guildID: message.guild.id
                }, {
                    guildVolume: newVolume
                }).then(() => {
                    message.reply({ embeds: [embed] })
                }).catch((err) => {
                    if (err) console.log(err);
                    embed.setColor("FF0000")
                    embed.setDescription(`Couldn't change the volume to **${newVolume}**`)
                    message.reply({ embeds: [embed] })
                })
                break;
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