const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "youtube",
    description: "Starts a Youtube watch party",
    async execute(client, message, args) {

        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
                const msgEmbed = new MessageEmbed()
                    .setColor("F9A602")
                    .setTitle("Started a Youtube watch party")
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
                    .setFooter('Youtube', 'https://cdn.discordapp.com/app-icons/880218394199220334/bc5f23f13943c4b5414a3bb4fefdb4c1.png?size=80&keep_aspect_ratio=false')
                return message.reply({ embeds: [msgEmbed] });
            });
        } else {
            await message.reply(`⛔ You must be in a voice channel to start a Youtube watch party`)
        }
    }
}