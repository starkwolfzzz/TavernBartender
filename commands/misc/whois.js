const { MessageEmbed } = require('discord.js');
const { Message } = require("discord.js")

module.exports = {
    name: "whois",
    description: "Replies with information about the given user",
    permissions: "ADMINISTRATOR",
    /**
     * 
     * @param {Message} message
     * @returns 
     */
    async execute(client, message, args) {
        if (!message.member.permissions.toArray().includes(this.permissions)) {
            return;
        }

        var embed;
        switch (true) {
            case (args.length == 0 || args.length == 1):
                var memberId;
                var member;

                if (args.length == 0) {
                    memberId = message.author.id;
                    member = message.member;
                } else {
                    memberId = args[0].replace("<@", "").replace("!", "").replace(">", "");
                    member = message.guild.members.cache.find(mmbr => mmbr.id === memberId);
                }

                if (member) {
                    embed = new MessageEmbed();

                    embed.setAuthor({ name: `${member.user.username}#${member.user.discriminator}`, iconUrl: member.user.avatarURL()})
                    embed.setThumbnail(member.user.avatarURL())
                    embed.setDescription(`<@${memberId}>`)
                    embed.setFooter({ text: `ID: ${memberId}` })
                    embed.setTimestamp();

                    embed.addField(`Joined`, timeConverter(member.joinedTimestamp), true);
                    embed.addField(`Registered`, timeConverter(member.user.createdTimestamp), true);

                    var listOfRoles = [];
                    var z = 0;
                    member.roles.cache.forEach(role => {
                        z++;
                        if (z == 1) embed.setColor(role.hexColor.replace("#", ""))

                        if (role.name != "@everyone") {
                            listOfRoles.push(role);
                        }
                    })

                    var roleString = "";
                    if (listOfRoles.length == 0) {
                        roleString = `none`;
                        embed.setColor("F9A602")
                    } else {
                        listOfRoles.forEach(role => {
                            roleString += `<@&${role.id}> `
                        })
                    }
                    embed.addField(`Roles [${listOfRoles.length}]`, roleString);

                    var listOfActualPermissions = [];
                    member.permissions.toArray().forEach(perm => {
                        while (perm.includes("_")) {
                            perm = perm.replace("_", " ");
                        }

                        listOfActualPermissions.push(titleCase(perm.toLowerCase()));
                    })

                    var listOfPermissions = [];
                    var listOfKeyPermissions = ["Kick Members", "Ban Members", "Administrator", "Manage Channels", "Manage Guild", "View Audit Log", "Priority Speaker", "Manage Messages", "Attach Files", "Mention Everyone", "View Guild Insights", "Mute Members", "Deafen Members", "Move Members", "Manage Nicknames", "Manage Roles", "Manage Webhooks", "Manage Emojis And Stickers", "Manage Threads"]
                    listOfKeyPermissions.forEach(keyPerm => {
                        if (listOfActualPermissions.indexOf(keyPerm) != -1) {
                            listOfPermissions.push(keyPerm)
                        }
                    })

                    var PermissionsString = "";
                    if (listOfPermissions.length == 0) {
                        PermissionsString = `none`;
                    } else {
                        var x = 0;
                        listOfPermissions.forEach(perm => {
                            x++;
                            if (x != listOfPermissions.length) PermissionsString += `${perm}, `
                            else PermissionsString += `${perm}`
                        })
                    }
                    embed.addField(`Key Permissions`, PermissionsString);

                    var listOfModPermissions = ["Kick Members", "Ban Members", "Administrator", "Manage Channels", "Manage Guild", "View Audit Log", "Priority Speaker", "Manage Messages", "View Guild Insights", "Mute Members", "Deafen Members", "Move Members", "Manage Nicknames", "Manage Roles", "Manage Webhooks", "Manage Emojis And Stickers", "Manage Threads"]
                    var isMod = false;
                    listOfModPermissions.forEach(modPerm => {
                        if (listOfPermissions.indexOf(modPerm) != -1) {
                            isMod = true;
                        }
                    })

                    if (message.guild.ownerId == memberId) {
                        embed.addField(`Acknowledgment`, `Server Owner`);
                    } else if (listOfPermissions.includes(`Administrator`)) {
                        embed.addField(`Acknowledgment`, `Server Adminstrator`);
                    } else if (isMod) {
                        embed.addField(`Acknowledgment`, `Server Moderator`);
                    }

                    switch (true) {
                        case (memberId == 460454915568041984):
                            embed.addField(`Member Note`, `Stark Industries Owner`);
                            break;
                        case (memberId == 920685407782449162):
                            embed.addField(`Member Note`, `Stark Industries Owner's Alt`);
                            break;
                        case (memberId == 779698668395692063):
                            embed.addField(`Member Note`, `Stark Industries Owner's Alt`);
                            break;
                        case (memberId == 354153578635591690):
                            embed.addField(`Member Note`, `✓certified BigMan`);
                            break;
                        case (memberId == 891635965234384896):
                            embed.addField(`Member Note`, `Stark Industries Bot`);
                            break;
                        case (memberId == 914898163750559774):
                            embed.addField(`Member Note`, `Stark Industries Bot`);
                            break;
                        case (memberId == 899631291077652491):
                            embed.addField(`Member Note`, `Stark Industries Bot`);
                            break;
                        case (memberId == 920744344963665961):
                            embed.addField(`Member Note`, `Stark Industries Bot`);
                            break;
                    }

                    message.reply({ embeds: [embed] })
                } else {
                    embed = new MessageEmbed()
                        .setColor("FF0000")
                        .setDescription(`Couldn't find user ${memberId}`)
                    message.reply({ embeds: [embed] })
                }
                break;
            case (args.length > 1):
                embed = new MessageEmbed()
                    .setColor("FF0000")
                    .setDescription(`This command is limited to only one argument, please try again later.`)
                message.reply({ embeds: [embed] })
                break;
        }
    }
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function timeConverter(timestamp) {
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    var date = new Date(timestamp).toLocaleDateString('en-US', dateOptions)

    const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
    var time = new Date(timestamp).toLocaleTimeString('en-US', timeOptions)

    return `${date} ${time}`
}