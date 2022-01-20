const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "youtubedev",
    description: "Starts a YoutubeDev watch party",
    async execute(client, message, args) {

        if (message.member.user.id == "460454915568041984") {
            if (message.member.voice.channel) {
                client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtubeDev').then(async invite => {
                    const msgEmbed = new MessageEmbed()
                        .setColor("F9A602")
                        .setTitle("Started a YoutubeDev watch party")
                        .setURL(`${invite.code}`)
                        .setDescription(`Join the watch party by clicking [here](${invite.code})`)
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
                        .setFooter('YoutubeDev', 'https://cdn.discordapp.com/app-icons/880218832743055411/f22f4184f95706fef2024a10110d47aa.png?size=80&keep_aspect_ratio=false')
                    return message.reply({ embeds: [msgEmbed] });
                });
            } else {
                await message.reply(`⛔ You must be in a voice channel to start a YoutubeDev watch party`)
            }
        } else {
            await message.reply(`⛔ You do not have permission to start a YoutubeDev watch party`)
        }
    }
}