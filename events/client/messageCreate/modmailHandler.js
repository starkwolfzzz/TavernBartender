const GUILD_ID = process.env['GUILD_ID'];
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;

        if (message.channel.type === "DM") {
            if (client.guilds.cache.find(guild => guild.id === GUILD_ID).members.cache.find(m => m.id === message.author.id)) {
                let category = client.guilds.cache.find(guild => guild.id === GUILD_ID).channels.cache.find(c => c.name == "Mod Mail" && c.type == "GUILD_CATEGORY");
                let modChnl = client.guilds.cache.find(guild => guild.id === GUILD_ID).channels.cache.find(c => c.name == (`${message.author.username.replace(" ", "")}-${message.author.id}`).toLowerCase());
                if (modChnl == null || modChnl.parentId != category.id) {
                    client.guilds.cache.find(guild => guild.id === GUILD_ID).channels.create(`${message.author.username.replace(" ", "")}-${message.author.id}`, "text").then(channel => {
                        channel.setParent(category);
                        modChnl = channel;
                        let member = client.guilds.cache.find(guild => guild.id === GUILD_ID).members.cache.find(m => m.id === message.author.id);
                        let roles = member.roles.cache;
                        let rolesStr = "";

                        roles.forEach(role => {
                            if (role.name != "@everyone") {
                                rolesStr += `<@&${role.id}> `;
                            }
                        })

                        const ticketMsg = new MessageEmbed()
                            .setColor("F9A602")
                            .setTitle("New Ticket")
                            .setDescription(`Type a message in this channel to reply. Messages starting with the bot prefix ` + "`" + `${client.prefix}` + "`" + ` are ignored, and can be used for staff discussion. Use the command ` + "`" + `${client.prefix}close [reason]` + "`" + ` to close this ticket.`)
                            .addFields({
                                name: 'User',
                                value: `<@${message.author.id}> (${message.author.id})`,
                                inline: true
                            }, {
                                name: 'Roles',
                                value: `${rolesStr}`,
                                inline: true
                            })
                            .setTimestamp()
                            .setFooter(`${message.author.username} | ${message.author.id}`, `${message.author.avatarURL()}`);

                        modChnl.send({ content: `<@&920635504368693248>`, embeds: [ticketMsg] })

                        const sentMsg = new MessageEmbed()
                            .setColor("00FF00")
                            .setTitle("Message Recieved")
                            .setDescription(`${message.content}`)
                            .setTimestamp()
                            .setFooter(`${message.author.username} | ${message.author.id}`, `${message.author.avatarURL()}`);
                        let i = 0;
                        message.attachments.forEach(attachment => {
                            i += 1;

                            sentMsg.addField(`Attachment ${i}`, `${attachment.url}`)
                        })
                        modChnl.send({ embeds: [sentMsg] })

                        const sentMsgReciept = new MessageEmbed()
                            .setColor("00FF00")
                            .setTitle("Message Sent")
                            .setDescription(`${message.content}`)
                            .setTimestamp()
                            .setFooter(`${category.guild.name} | ${category.guild.id}`, `${category.guild.iconURL()}`);
                        i = 0;
                        message.attachments.forEach(attachment => {
                            i += 1;

                            sentMsgReciept.addField(`Attachment ${i}`, `${attachment.url}`)
                        })
                        message.author.send({ embeds: [sentMsgReciept] })
                    })
                } else {
                    const sentMsg = new MessageEmbed()
                        .setColor("00FF00")
                        .setTitle("Message Recieved")
                        .setDescription(`${message.content}`)
                        .setTimestamp()
                        .setFooter(`${message.author.username} | ${message.author.id}`, `${message.author.avatarURL()}`);
                    let i = 0;
                    message.attachments.forEach(attachment => {
                        i += 1;

                        sentMsg.addField(`Attachment ${i}`, `${attachment.url}`)
                    })
                    modChnl.send({ embeds: [sentMsg] })

                    const sentMsgReciept = new MessageEmbed()
                        .setColor("00FF00")
                        .setTitle("Message Sent")
                        .setDescription(`${message.content}`)
                        .setTimestamp()
                        .setFooter(`${category.guild.name} | ${category.guild.id}`, `${category.guild.iconURL()}`);
                    i = 0;
                    message.attachments.forEach(attachment => {
                        i += 1;

                        sentMsgReciept.addField(`Attachment ${i}`, `${attachment.url}`)
                    })
                    message.author.send({ embeds: [sentMsgReciept] })
                }
            }
            return;
        }

        let mmbr = client.guilds.cache.find(guild => guild.id === GUILD_ID).members.cache.find(m => m.id === message.channel.name.substring(message.channel.name.indexOf("-") + 1));
        if (mmbr != null && message.channel.parent.name == "Mod Mail") {
            if (!message.content.startsWith(client.prefix)) {
                const sentMsg = new MessageEmbed()
                    .setColor("FF0000")
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                    .setTitle("Message Sent")
                    .setDescription(`${message.content}`)
                    .setTimestamp()
                    .setFooter(`${message.author.username} | ${message.author.id}`, `${message.author.avatarURL()}`);

                let i = 0;
                message.attachments.forEach(attachment => {
                    i += 1;

                    sentMsg.addField(`Attachment ${i}`, `${attachment.url}`)
                })
                message.channel.send({ embeds: [sentMsg] })

                const sentMsgReciept = new MessageEmbed()
                    .setColor("FF0000")
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                    .setTitle("Message Recieved")
                    .setDescription(`${message.content}`)
                    .setTimestamp()
                    .setFooter(`${message.guild.name} | ${message.guild.id}`, `${message.guild.iconURL()}`);
                i = 0;
                message.attachments.forEach(attachment => {
                    i += 1;

                    sentMsgReciept.addField(`Attachment ${i}`, `${attachment.url}`)
                })
                mmbr.send({ embeds: [sentMsgReciept] })

                message.delete();
            } else {
                args = message.content.slice(client.prefix.length).split(/ +/);
                const command = args.shift().toLowerCase();

                if (command == "close") {
                    let reason;
                    if (args.length == 0) reason = "no reason was provided.";
                    else reason = args.join(" ")

                    const closeTicketMsg = new MessageEmbed()
                        .setColor("FF0000")
                        .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                        .setTitle("Ticket Closed")
                        .setDescription(`${reason}`)
                        .setTimestamp()
                        .setFooter(`${message.guild.name} | ${message.guild.id}`, `${message.guild.iconURL()}`);
                    mmbr.send({ embeds: [closeTicketMsg] })
                    message.channel.delete();
                }
            }
        }


    },
};