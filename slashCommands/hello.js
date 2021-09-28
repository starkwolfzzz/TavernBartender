

module.exports = {
    name: "hello",
    description: "Says hey back",
    async execute(client, interaction) {
        interaction.reply({ content: `Hey, <@${interaction.user.id}>!` })
    }
}