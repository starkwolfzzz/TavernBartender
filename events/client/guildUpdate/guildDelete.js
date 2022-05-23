const guildSchema = require("../../../schemas/guildSchema")

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        console.log(`\x1b[31mLeft: \x1b[0m${guild.name}`)
        guildSchema.deleteOne({ guildID: guild.id }).then(() => {
            var x = 0;
            client.guilds.cache.forEach(async guild => {
                x = x + 1
                await guildSchema.updateOne({
                    guildID: guild.id
                }, {
                    docID: x - 1
                })
            });
        })
    },
};