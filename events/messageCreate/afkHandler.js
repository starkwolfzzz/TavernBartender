const fs = require('fs');

async function getAFK(userId) {
    let filePath = "./afk.json";
    let afkMsg;
    let timestamp;

    obj = JSON.parse(fs.readFileSync(filePath))
    if (obj.users[userId] != null && obj.users[userId][0] && obj.users[userId][1]) {
        afkMsg = obj.users[userId][0];
        timestamp = obj.users[userId][1];
    } else afkMsg = "ERROR NOT AFK";

    return [afkMsg, timestamp];
}

function changeAFK(userId, reason, type = "add") {
    let filePath = "./afk.json";
    let timestamp = Date.now();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            if (type == "add") {
                obj.users[userId] = [reason, timestamp];
            } else {
                delete obj.users[userId];
            }

            json = JSON.stringify(obj);
            fs.writeFile(filePath, json, 'utf8', () => {});
        }
    });
}

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        if (message.channel.type === "DM") return;
        
        //#region Afk
        let afkArray = await getAFK(message.member.id)
        if (afkArray[0] != "ERROR NOT AFK") {
            if (!msToTime((Date.now() - afkArray[1])).includes("milliseconds") && !msToTime((Date.now() - afkArray[1])).includes("millisecond") && !msToTime((Date.now() - afkArray[1])).includes("seconds") && !msToTime((Date.now() - afkArray[1])).includes("second")) {
                changeAFK(message.author.id, "removing", "remove")
                if (message.member.nickname && message.member.nickname.substring(0, 6) == "[AFK] ") message.member.setNickname(message.member.nickname.substring(6, message.member.nickname.length))
                message.channel.send(`Welcome back <@${message.member.id}>, I removed your AFK`)
            }
        }

        for (i = 0; i < message.mentions.members.size; i++) {
            if (message.mentions.members.map(member => member.id)[i] != message.author.id) {
                afkArray = await getAFK(message.mentions.members.map(member => member.id)[i])
                var afk = afkArray[0];
                var timestamp = afkArray[1];
                var nickname;

                if (message.mentions.members.map(member => member.nickname)[i]) nickname = message.mentions.members.map(member => member.nickname)[i];
                else nickname = message.mentions.members.map(member => member.user)[i].username;

                if (afk != "ERROR NOT AFK") {
                    message.channel.send("`" + nickname + "` is AFK: " + afk + " - " + msToTime((Date.now() - timestamp)) + " ago")
                }
            }
        }

        function msToTime(duration) {
            var milliseconds = parseInt((duration % 1000) / 100),
                seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
                days = Math.floor((duration / (1000 * 60 * 60 * 24)));

            if (days > 0) {
                if (days == 1) {
                    return days + " day";
                } else {
                    return days + " days";
                }
            } else if (hours > 0) {
                if (hours == 1) {
                    return hours + " hour";
                } else {
                    return hours + " hours";
                }
            } else if (minutes > 0) {
                if (minutes == 1) {
                    return minutes + " minute";
                } else {
                    return minutes + " minutes";
                }
            } else if (seconds > 0) {
                if (seconds == 1) {
                    return seconds + " second";
                } else {
                    return seconds + " seconds";
                }
            } else if (milliseconds > 0) {
                if (milliseconds == 1) {
                    return milliseconds + " millisecond";
                } else {
                    return milliseconds + " milliseconds";
                }
            };
        }
        //#endregion

    },
};