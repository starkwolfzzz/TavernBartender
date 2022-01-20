const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "chessdev",
    description: "Starts a ChessDev play party",
    async execute(client, message, args) {

        if (message.member.user.id == "460454915568041984") {
            if (message.member.voice.channel) {
                client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chessDev').then(async invite => {
                    const msgEmbed = new MessageEmbed()
                        .setColor("F9A602")
                        .setTitle("Started a ChessDev play party")
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
                        .setFooter('ChessDev', 'https://cdn.discordapp.com/app-icons/832012774040141894/3b3981ddf67c8702920fae10b5f123ed.png?size=80&keep_aspect_ratio=false')
                    return message.reply({ embeds: [msgEmbed] });
                });
            } else {
                await message.reply(`⛔ You must be in a voice channel to start a ChessDev play party`)
            }
        } else {
            await message.reply(`⛔ You do not have permission to start a ChessDev Dev watch party`)
        }
    }
}