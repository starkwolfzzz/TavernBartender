const { CommandInteraction, MessageEmbed, Client } = require('discord.js')

module.exports = {
    name: "nowplaying",
    description: "Display info about the song currently being played",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in a voice channel to use music commands.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | You must be in my current voice channel to do that.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | There is nothing playing.`)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

        try {

            const status = async queue =>
                `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
                queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Song') : 'None'
                }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

            var duration = queue.songs[0].duration;
            var currentTime = queue.currentTime;

            var knobPlace = Math.ceil(currentTime / (duration / 10))
            var knob = "🔘"
            var slash = "▬"
            var slashesBefore = knobPlace - 1;
            var slashesAfter = 10 - knobPlace;

            const song = queue.songs[0];
            var knobStr = insertChar(slash, slashesBefore) + knob + insertChar(slash, slashesAfter)

            var state = "";
            if(queue.paused) state = "⏸️"
            else state = "▶️"

            var user = client.guilds.cache.get(queue.voiceChannel.guildId).members.cache.get(song.user.id).user;
            var embed = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor({ name: `Requested by: ${user.username}#${user.discriminator}`, iconURL: user.avatarURL() })
                .setURL(song.url)
                .setTitle(`Playing: ${song.name}`)
                .setDescription(`${state} | ${knobStr} \`[${queue.formattedCurrentTime} / ${song.formattedDuration}]\`\n${await status(queue)}`)
                .setImage(song.thumbnail)

            return interaction.reply({ embeds: [embed] })

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}

function insertChar(char, frequency) {
    var num = 0;
    var c = "";
    for (i = 0; i < frequency; i++) {
        c += char;
        num++
    }
    return (c);
}