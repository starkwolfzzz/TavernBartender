const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "betrayal",
    description: "Starts a Betrayal play party",
    async execute(client, message, args) {

        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'betrayal').then(async invite => {
                const msgEmbed = new MessageEmbed()
                    .setColor("F9A602")
                    .setTitle("Started a Betrayal play party")
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
                    .setFooter('Betrayal', 'https://cdn.discordapp.com/app-icons/773336526917861400/0227b2e89ea08d666c43003fbadbc72a.png?size=80&keep_aspect_ratio=false')
                return message.reply({ embeds: [msgEmbed] });
            });
        } else {
            await message.reply(`⛔ You must be in a voice channel to start a Betrayal play party`)
        }
    }
}