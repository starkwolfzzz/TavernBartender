

module.exports = {
    name: "queue",
    description: "shows music queue",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        message.reply(`Now playing: ${guildQueue.songs}`)
    }
}