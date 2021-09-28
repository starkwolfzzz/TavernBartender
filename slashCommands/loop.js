var index = require('../index.js')

module.exports = {
    name: "loop",
    description: "Loops music",
    options: [{
        name: "type",
        description: "The type of the loop to use on the music",
        type: "STRING",
        choices: [
            {
                name: "None",
                value: "none"
            },
            {

                name: "Song",
                value: "song"
            }, 
            {
                name: "Queue",
                value: "queue"
            }
        ],
        required: true
    }],
    async execute(client, interaction) {
        index.setLoop(interaction.options.getString("type"));
        interaction.reply({ content: `**Loop type set to ${interaction.options.getString("type")}**`})
    }
}