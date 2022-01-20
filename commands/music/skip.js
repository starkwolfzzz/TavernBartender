module.exports = {
    name: "skip",
    description: "Skips a song",
    async execute(client, message, args) {
        let guildQueue = client.player.getQueue(message.guild.id);
        guildQueue.skip();
        await message.react("✅")
        await message.channel.send("Skipped song!");
    }
}