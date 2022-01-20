const { RepeatMode } = require("discord-music-player");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "loop",
    description: "shows or sets loop type for music playback",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue || message.member.voice.channel != guildQueue.connection.channel) {
            const errorEmbed = new MessageEmbed()
                .setColor("FF0000")
                .setTitle("Loop Change Error")
                .setDescription(`Must be playing music to change loop settings.`)
                .setTimestamp()
                .setFooter(`Couldn't change loop type`)

            if(message.member.voice.channel != guildQueue.connection.channel) errorEmbed.setDescription("Must be in the channel playing music to change loop settings.")

            message.reply({ embeds: [errorEmbed] })

            return;
        }

        if (args[0] == "none" || args[0] == "song" || args[0] == "queue") {
            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Loop Type Change")
                .setDescription(`Type changed from ${client.loop} to ${args[0]}`)
                .addFields({ name: 'Function', value: 'Change Loop type', inline: true }, { name: 'Old', value: `${client.loop}`, inline: true }, )
                .addField('New', `${args[0]}`, true)
                .setTimestamp()
                .setFooter(`New type: ${args[0]}`)

            loop = args[0];
            switch (args[0]) {
                case "none":
                    guildQueue.setRepeatMode(RepeatMode.DISABLED);
                    client.loop = args[0];
                    break;
                case "song":
                    guildQueue.setRepeatMode(RepeatMode.SONG);
                    client.loop = args[0];
                    break;
                case "queue":
                    guildQueue.setRepeatMode(RepeatMode.QUEUE);
                    client.loop = args[0];
                    break;
            }
            message.reply({ embeds: [msgEmbed] })
        } else {
            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Music Loop Type Check")
                .setDescription(`Loop type is set to ${client.loop}`)
                .addFields({ name: 'Function', value: 'Check Type', inline: true })
                .addField('Loop Type', `${client.loop}`, true)
                .setTimestamp()
                .setFooter(`Type: ${client.loop}`)

            message.reply({ embeds: [msgEmbed] })
        }
    }
}