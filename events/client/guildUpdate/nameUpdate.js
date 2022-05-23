const guildSchema = require("../../../schemas/guildSchema")

module.exports = {
    name: 'guildUpdate',
    async execute(client, oldGuild, newGuild) {
        if (newGuild.name != oldGuild.name) {
            await guildSchema.updateOne({
                guildID: newGuild.id
            }, {
                guildName: newGuild.name
            })
        }
    },
};