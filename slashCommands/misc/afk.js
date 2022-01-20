let index = require("../../index")

module.exports = {
    name: "afk",
    description: "Makes a user AFK",
    options: [{
        name: "reason",
        description: "The reason you are going AFK",
        type: "STRING",
        required: false
    }, ],
    async execute(client, interaction) {
        var reason;

        if(!interaction.options.getString("reason")){
            reason = "AFK"
        } else reason = interaction.options.getString("reason");

        if(interaction.member.nickname){
            if (interaction.member.nickname.substring(0, 6) != "[AFK] " && interaction.member.nickname.length + 6 <= 32) {
                interaction.member.setNickname(`[AFK] ${interaction.member.nickname}`).catch((error) => {
                    console.log(`${error.name}: ${error.message}`)
                })
            }
        } else {
            if (interaction.member.user.username.length + 6 <= 32) {
                interaction.member.setNickname(`[AFK] ${interaction.member.user.username}`).catch((error) => {
                    console.log(`${error.name}: ${error.message}`)
                })
            }
        }

        index.changeAFK(interaction.member.id, reason, "add")

        interaction.reply(`<@${interaction.member.id}> I set your AFK: ${reason}`)
    }
}