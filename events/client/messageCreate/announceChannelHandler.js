require('dotenv').config();

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        if (message.channel.type === "DM") return;

        switch (message.channel.name) {
            case "announcements":
                if (message.channel.id === "757302622842781699") {
                    message.crosspost()
                }
                break;
        }
    },
};