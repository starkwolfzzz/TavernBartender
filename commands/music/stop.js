

module.exports = {
    name: "stop",
    description: "Stops music playback",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.stop();
        await message.reply("Stopped music playback!");
        await message.react("✅")
    }
}