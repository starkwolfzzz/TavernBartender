const { CommandInteraction, MessageEmbed, Client } = require('discord.js')
const Genius = require("genius-lyrics");
var Vibrant = require('node-vibrant');

module.exports = {
    name: "lyrics",
    description: "Get the lyrics of a specific song",
    options: [{
        name: "song",
        description: "Search song",
        type: "STRING",
    }],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(client, interaction) {
        const geniusClient = new Genius.Client(client.genius);
        const { options, member, guild, channel } = interaction;

        const voiceChannel = member.voice.channel;
        const queue = await client.distube.getQueue(voiceChannel);

        var songName = "";

        if (options.getString("song")) songName = options.getString("song");
        else if (queue && queue.songs[0].name) songName = queue.songs[0].name;

        if (!songName) {
            if (!queue) {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | There is nothing currently playing.`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            } else if (!options.getString("song")) {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | Please provide a song name to search the lyrics for.`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        }

        try {

            const searches = await geniusClient.songs.search(songName);

            const firstSong = searches[0];
            if (firstSong) {
                const lyrics = await firstSong.lyrics();
                var embed = new MessageEmbed()
                    .setColor("RED")
                    .setAuthor({ name: firstSong.artist.name, iconURL: firstSong.artist.thumbnail })
                    .setURL(firstSong.url)
                    .setTitle(firstSong.fullTitle)
                    .setDescription(lyrics)
                    .setThumbnail(firstSong.raw.song_art_image_url)
                return interaction.reply({ embeds: [embed] })
                    /*let v = new Vibrant(firstSong.raw.song_art_image_url)
                    v.getPalette((err, palette) => {
                        if (err) {
                            var errorEmbed = new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`❌ | An Unexpected Error Occured: ${err.toString().slice(0, 4000)}`)

                            console.log(err)
                            return interaction.reply({ embeds: [errorEmbed] })
                        } else {
                            var embed = new MessageEmbed()
                                .setColor(palette.Vibrant.hex)
                                .setAuthor({ name: firstSong.artist.name, iconURL: firstSong.artist.thumbnail })
                                .setURL(firstSong.url)
                                .setTitle(firstSong.fullTitle)
                                .setDescription(lyrics)
                                .setThumbnail(firstSong.raw.song_art_image_url)
                            return interaction.reply({ embeds: [embed] })
                        }
                    })*/
            } else {
                var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ | Couldn't find lyrics for ${songName}.`)
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }

        } catch (e) {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An Unexpected Error Occured: ${e.toString().slice(0, 4000)}`)

            console.log(e)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    }
}