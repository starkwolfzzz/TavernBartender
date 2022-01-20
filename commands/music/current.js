

module.exports = {
    name: "current",
    description: "shows current song being played",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        message.reply(`Now playing: ${guildQueue.nowPlaying}`)
    }
}