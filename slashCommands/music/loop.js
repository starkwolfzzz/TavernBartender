
const { MessageEmbed } = require('discord.js');
const { RepeatMode } = require("discord-music-player");

module.exports = {
    name: "loop",
    description: "Loops music",
    options: [{
        name: "type",
        description: "The type of the loop to use on the music",
        type: "STRING",
        choices: [{
                name: "None",
                value: "none"
            },
            {
                name: "Song",
                value: "song"
            },
            {
                name: "Queue",
                value: "queue"
            }
        ]
    }],
    async execute(client, interaction) {
        let guildQueue = client.player.getQueue(interaction.guild.id);
        if (interaction.options.getString("type") == "none" || interaction.options.getString("type") == "song" || interaction.options.getString("type") == "queue") {
            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Loop Type Change")
                .setDescription(`Type changed from ${client.loop} to ${interaction.options.getString("type")}`)
                .addFields({ name: 'Function', value: 'Change Loop type', inline: true }, { name: 'Old', value: `${client.loop}`, inline: true }, )
                .addField('New', `${interaction.options.getString("type")}`, true)
                .setTimestamp()
                .setFooter(`New type: ${interaction.options.getString("type")}`)

            loop = interaction.options.getString("type");
            switch (interaction.options.getString("type")) {
                case "none":
                    guildQueue.setRepeatMode(RepeatMode.DISABLED);
                    client.loop = interaction.options.getString("type");
                    break;
                case "song":
                    guildQueue.setRepeatMode(RepeatMode.SONG);
                    client.loop = interaction.options.getString("type");
                    break;
                case "queue":
                    guildQueue.setRepeatMode(RepeatMode.QUEUE);
                    client.loop = interaction.options.getString("type");
                    break;
            }

            interaction.reply({ embeds: [msgEmbed] })
        } else {
            const msgEmbed = new MessageEmbed()
                .setColor("F9A602")
                .setTitle("Music Loop Type Check")
                .setDescription(`Loop type is set to ${client.loop}`)
                .addFields({ name: 'Function', value: 'Check Type', inline: true })
                .addField('Loop Type', `${client.loop}`, true)
                .setTimestamp()
                .setFooter(`Type: ${client.loop}`)

            interaction.reply({ embeds: [msgEmbed] })
        }
    }
}