const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "lettertile",
    description: "Starts a Letter Tile play party",
    async execute(client, message, args) {

        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'lettertile').then(async invite => {
                const msgEmbed = new MessageEmbed()
                    .setColor("F9A602")
                    .setTitle("Started a Letter Tile play party")
                    .setURL(`${invite.code}`)
                    .setDescription(`Join the play party by clicking [here](${invite.code})`)
                    .addFields({
                        name: 'Channel',
                        value: `${message.member.voice.channel.name}`,
                        inline: true
                    }, {
                        name: 'User',
                        value: `${message.member.user.username}#${message.member.user.discriminator}`,
                        inline: true
                    }, )
                    .addField(`Link`, `[Join here](${invite.code})`, true)
                    .setTimestamp()
                    .setFooter('Letter Tile', 'https://cdn.discordapp.com/app-icons/879863686565621790/ea5349b472917347d60e09fcdbf65af1.png?size=80&keep_aspect_ratio=false')
                return message.reply({ embeds: [msgEmbed] });
            });
        } else {
            await message.reply(`⛔ You must be in a voice channel to start a Letter Tile play party`)
        }
    }
}