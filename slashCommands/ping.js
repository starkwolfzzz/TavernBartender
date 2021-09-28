

module.exports = {
    name: "ping",
    description: "Replies with the latency of the bot",
    async execute(client, interaction) {
        interaction.reply({ content: 'Pinging...' })
        const message = await interaction.fetchReply();
        const timestamp = message.createdTimestamp;
        const latency = timestamp - interaction.createdTimestamp;
        // const apiLatency = Math.round(client.ws.ping)
        // var latency = ping - apiLatency
        interaction.editReply({ content: `Pong! **Latency**: ${latency}`})
    }
}