const guildSchema = require("../../../schemas/guildSchema")

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        if (message.channel.type === "DM") return;

        var args;

        const searchById = guildSchema.find({
            guildID: message.guild.id
        })

        var prefix = (await searchById)[0].guildPrefix;

        if (!message.content.startsWith(prefix)) return;
        args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);
        if (!cmd) return;
        try {
            await cmd.execute(client, message, args);
        } catch (error) {
            if (error) console.error(error);
            await message.reply({ content: 'There was an error while executing this command!' });
        }
    },
};