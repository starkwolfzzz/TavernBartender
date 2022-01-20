let index = require("../../index")

module.exports = {
    name: "afk",
    description: "Makes a user AFK",
    async execute(client, message, args) {
        var reason;

        if (args.length == 0) {
            reason = "AFK"
        } else reason = args.join(' ');

        if(message.member.nickname){
            if (message.member.nickname.substring(0, 6) != "[AFK] " && message.member.nickname.length + 6 <= 32) {
                message.member.setNickname(`[AFK] ${message.member.nickname}`).catch((error) => {
                    console.log(`${error.name}: ${error.message}`)
                })
            }
        } else {
            if (message.member.user.username.length + 6 <= 32) {
                message.member.setNickname(`[AFK] ${message.member.user.username}`).catch((error) => {
                    console.log(`${error.name}: ${error.message}`)
                })
            }
        }

        index.changeAFK(message.author.id, reason, "add")

        message.reply(`<@${message.author.id}> I set your AFK: ${reason}`)
    }
}