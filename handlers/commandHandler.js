const {
    Collection
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'commandHandler',
    async execute(client) {
        const commands = [];
        client.commands = new Collection();

        var topBars = 60;
        console.log(insertChar("_", topBars))
        console.log("|" + insertChar(" ", Math.round(((topBars - 1) - (`Commands`).length) / 2)) + "Commands" + insertChar(" ", Math.floor(((topBars - 1) - (`Commands`).length) / 2)) + "|")
        console.log("|" + insertChar("_", topBars - 1) + "|")
        console.log("|" + insertChar(" ", topBars - 1) + "|")
        const readCommands = dir => {
            const commandFiles = fs.readdirSync(path.join(__dirname, dir));
            for (const file of commandFiles) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                if (stat.isDirectory()) {
                    readCommands(path.join(dir, file))
                } else {
                    const command = require(path.join(__dirname, dir, file));
                    var neededSpace1 = Math.round(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file).length) / 2);
                    var neededSpace2 = Math.floor(((topBars - 1) - ('Loaded: ' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "/" + file).length) / 2);
                    console.log("|" + insertChar(" ", neededSpace1) + '\x1b[32mLoaded:\x1b[0m \x1b[33m' + dir.substring(dir.indexOf("\\") + 1, dir.length).replace("\\", "/").replace("../", "").replace("\\", "/") + "\x1b[0m/\x1b[36m" + file + "\x1b[0m" + insertChar(" ", neededSpace2) + "|");
                    commands.push(command);
                    client.commands.set(command.name, command);
                }
            }
        }

        readCommands('../commands')
        console.log("|" + insertChar(" ", topBars - 1) + "|")
        console.log(insertChar("‾", topBars))

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
}