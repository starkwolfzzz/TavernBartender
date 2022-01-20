const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "fishington",
    description: "Starts a Fishington play party",
    async execute(client, message, args) {

        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'fishing').then(async invite => {
                const msgEmbed = new MessageEmbed()
                    .setColor("F9A602")
                    .setTitle("Started a Fishington play party")
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
                    .setFooter('Fishington', 'https://cdn.discordapp.com/app-icons/814288819477020702/0cafdebe76abfd7d8d9b015c2060512e.png?size=80&keep_aspect_ratio=false')
                return message.reply({ embeds: [msgEmbed] });
            });
        } else {
            await message.reply(`⛔ You must be in a voice channel to start a Fishington play party`)
        }
    }
}