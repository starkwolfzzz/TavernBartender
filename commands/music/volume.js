module.exports = {
    name: "volume",
    description: "shows or sets volume of music playback",
    async execute(client, message, args) {
        const index = require("../../index.js");
        
        let guildQueue = client.player.getQueue(message.guild.id);
        if (args.length == 0) return message.reply(`**Volume**: ${client.volume}`)
        var newVolume = args[0];
        if (isNaN(newVolume)) return message.reply(`Please give a valid numeric value between 1 and 100 to set the volume`)

        if (newVolume > 100 || newVolume < 1) return message.reply(`Please give a value between 1 and 100 to set the volume`)

        client.volume = newVolume;
        index.changeCfg(client.prefix, client.volume);
        if (guildQueue != null) guildQueue.setVolume(client.volume);
        message.reply(`**Volume set to**: ${client.volume}`)
    }
}