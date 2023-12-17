const guildSchema = require("../../../schemas/guildSchema")
const config = require("../../../config.json");

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        const mainGuild = guild;

        //Check if guild exists on database
        var searchById = guildSchema.find({
            guildID: mainGuild.id,
        })

        if ((await searchById).length == 0) {
            const guild = {
                docID: (await guildSchema.countDocuments()),
                guildID: mainGuild.id,
                guildName: mainGuild.name,
                guildPrefix: config.prefix,
                guildVolume: config.volume,
                guildPlayChannelType: config.playChannelType,
            }

            await new guildSchema(guild).save()
        }

        //Check if guild name changed on database
        searchById = guildSchema.find({
            guildID: mainGuild.id,
        })

        if ((await searchById)[0].guildName != mainGuild.name) {
            await guildSchema.updateOne({
                guildID: mainGuild.id
            }, {
                guildName: mainGuild.name
            })
        }

        mainGuild.commands.set(client.slashCommands).then((cmd) => {
            const Roles = (commandName) => {
                const cmdPerms = client.slashCommands.find(c => c.name === commandName).Perms;

                if (!cmdPerms) return null;

                return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
            }

            const fullPermissions = cmd.reduce((accumulator, x) => {
                const roles = Roles(x.name);
                if (!roles) return accumulator;

                const permissions = roles.reduce((a, v) => {
                    return [...a, { id: v.id, type: "ROLE", permission: true }]
                }, []);

                return [...accumulator, { id: x.id, permissions }]
            }, []);

            mainGuild.commands.permissions.set({ fullPermissions })
                .catch((error) => {
                    console.log(`\x1b[32mJoined and updated: \x1b[0m${mainGuild.name}`);
                })
                .then(() => {
                    console.log(`\x1b[32mJoined and updated: \x1b[0m${mainGuild.name}`)
                });
        })
    },
};