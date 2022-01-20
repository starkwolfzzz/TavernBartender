const guildSchema = require("../../schemas/guildSchema")

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        var type = "streaming";
        client.user.setStatus("online");
        client.user.setActivity("with @Stark Wolfz#9300", {
            type: type.toUpperCase(),
            url: "https://twitch.tv/starkwolfzz"
        });

        //Slash commands
        topBars = 60;
        console.log(insertChar("_", topBars))
        console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "Updated Slash Guilds" + insertChar(" ", Math.floor(((topBars - 1) - (`Updated Slash Guilds`).length) / 2)) + "|")
        console.log("|" + insertChar("_", topBars - 1) + "|")
        console.log("|" + insertChar(" ", topBars - 1) + "|")

        var bar = new Promise(async (resolve, reject) => {
            var size = client.guilds.cache.size;
            var sizeW = size - 1;
            var n = 0;
            for (i = 0; i < size; i++) {
                const mainGuild = client.guilds.cache.get(client.guilds.cache.map(guild => guild.id)[i]);

                //Check if guild exists on database
                var searchById = guildSchema.find({
                    guildID: mainGuild.id,
                })
                
                if((await searchById).length == 0){
                    const guild = {
                        guildID: mainGuild.id,
                        guildName: mainGuild.name,
                        guildPrefix: "_"
                    }
    
                    await new guildSchema(guild).save()
                }

                //Check if guild name changed on database
                searchById = guildSchema.find({
                    guildID: mainGuild.id,
                })

                if((await searchById)[0].guildName != mainGuild.name){
                    await guildSchema.updateOne({
                        guildID: mainGuild.id
                    },
                    {
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
                            var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                            var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                            console.log("|" + insertChar(" ", neededSpace1) + "\x1b[31m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                            if (n == sizeW) {
                                resolve()
                            } else {
                                n += 1;
                            }
                        })
                        .then(() => {
                            var neededSpace1 = Math.round(((topBars - 1) - ((mainGuild.name).length)) / 2);
                            var neededSpace2 = Math.floor(((topBars - 1) - ((mainGuild.name).length)) / 2);
                            console.log("|" + insertChar(" ", neededSpace1) + "\x1b[32m" + mainGuild.name + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                            if (n == sizeW) {
                                resolve()
                            } else {
                                n += 1;
                            }
                        });
                })
            }
        })

        bar.then(() => {
            console.log("|" + insertChar(" ", topBars - 1) + "|")
            console.log(insertChar("‾", topBars))

            console.info(`${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`);
        })

        function insertChar(char, frequency) {
            var num = 1;
            var c = char;
            for (i = 1; i < frequency; i++) {
                c += char;
                num++
            }
            return (c);
        }
    },
};