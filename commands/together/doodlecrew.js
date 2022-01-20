const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "doodlecrew",
    description: "Starts a Doodle Crew play party",
    async execute(client, message, args) {

        if (message.member.voice.channel) {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'doodlecrew').then(async invite => {
                const msgEmbed = new MessageEmbed()
                    .setColor("F9A602")
                    .setTitle("Started a Doodle Crew play party")
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
                    .setFooter('Doodle Crew', 'https://cdn.discordapp.com/app-icons/878067389634314250/af01dbd1611cd3b4a8315d53ed11d1a6.png?size=80&keep_aspect_ratio=false')
                return message.reply({ embeds: [msgEmbed] });
            });
        } else {
            await message.reply(`⛔ You must be in a voice channel to start a Doodle Crew play party`)
        }
    }
}