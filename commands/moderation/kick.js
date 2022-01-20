const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: "kick",
    description: "Kicks a member from the server",
    async execute(client, message, args) {
        if (message.mentions.users.size >= 1 && message.mentions.users.first() != message.author) {
            var mmbr;
            mmbr = message.mentions.users.first();
            args.shift();

            if (message.guild.members.cache.find(m => m.id === client.user.id).permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                if (message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                    if (mmbr) {
                        if (message.guild.members.cache.find(m => m.id === mmbr.id)) {
                            if (message.guild.members.cache.find(m => m.id === mmbr.id).kickable) {
                                var reason;
                                if (args.length == 0) reason = "no reason provided.";
                                else reason = args.join(" ");

                                const kickEmbedMsg = new MessageEmbed()
                                    .setColor("00FF00")
                                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                                    .setTitle(`Kicked ${mmbr.username}#${mmbr.discriminator}`)
                                    .setDescription(`**Reason**: ${reason}`)
                                    .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                                    .setTimestamp()

                                const kickedEmbedMsg = new MessageEmbed()
                                    .setColor("FF0000")
                                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                                    .setTitle(`You have been kicked from ${message.guild.name}`)
                                    .setDescription(`**Reason**: ${reason}`)
                                    .setFooter(`${message.guild.name} | ${message.guild.id}`, `${message.guild.iconURL()}`)
                                    .setTimestamp()

                                let kickPrivMsg = await mmbr.send({ embeds: [kickedEmbedMsg] })

                                message.guild.members.cache.find(m => m.id === mmbr.id).kick(reason).then(() => {
                                    message.react("✅");
                                    message.reply({ embeds: [kickEmbedMsg] })
                                }).catch((error) => {
                                    console.log(`${error.name}: ${error.message}`);
                                    kickPrivMsg.delete();

                                    let err;

                                    if (error.message == "Missing Permissions") {
                                        err = "i don't have enough permissions."
                                    } else {
                                        err = "of an unkown reason."
                                    }

                                    kickEmbedMsg
                                        .setColor(`FF0000`)
                                        .setTitle(`An error occured`)
                                        .setDescription(`Couldn't kick <@${mmbr.id}> because ${err}`)

                                    message.react("⛔");
                                    message.reply({ embeds: [kickEmbedMsg] })
                                })
                            } else if (mmbr.id == client.user.id) {
                                const kickEmbedMsg = new MessageEmbed()
                                    .setColor(`FF0000`)
                                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                                    .setTitle(`An error occured`)
                                    .setDescription(`Couldn't kick <@${mmbr.id}> because it is I, silly.`)
                                    .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                                    .setTimestamp()

                                message.react("⛔");
                                message.reply({ embeds: [kickEmbedMsg] })
                            } else {
                                const kickEmbedMsg = new MessageEmbed()
                                    .setColor(`FF0000`)
                                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                                    .setTitle(`An error occured`)
                                    .setDescription(`Couldn't kick <@${mmbr.id}> because i don't have enough permissions.`)
                                    .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                                    .setTimestamp()

                                message.react("⛔");
                                message.reply({ embeds: [kickEmbedMsg] })
                            }
                        } else {
                            const kickEmbedMsg = new MessageEmbed()
                                .setColor(`FF0000`)
                                .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                                .setTitle(`An error occured`)
                                .setDescription(`Couldn't kick <@${mmbr.id}> because they're not on this server.`)
                                .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                                .setTimestamp()

                            message.react("⛔");
                            message.reply({ embeds: [kickEmbedMsg] })
                        }
                    }
                } else {
                    const kickEmbedMsg = new MessageEmbed()
                        .setColor("FF0000")
                        .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                        .setTitle(`An error occured`)
                        .setDescription(`You don't have permission to kick <@${mmbr.id}>.`)
                        .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                        .setTimestamp()

                    message.react("⛔");
                    message.reply({ embeds: [kickEmbedMsg] })
                }
            } else {
                const kickEmbedMsg = new MessageEmbed()
                    .setColor("FF0000")
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                    .setTitle(`An error occured`)
                    .setDescription(`I don't have permission to kick members.`)
                    .setFooter(`${client.user.username}#${client.user.discriminator}`, `${client.user.avatarURL()}`)
                    .setTimestamp()

                message.react("⛔");
                message.reply({ embeds: [kickEmbedMsg] })
            }
        } else if (message.mentions.users.first() == message.author) {
            const kickEmbedMsg = new MessageEmbed()
                .setColor("FF0000")
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                .setTitle(`An error occured`)
                .setDescription(`You cannot kick yourself.`)
                .setFooter(`${message.author.username} | ${message.author.id}`, `${message.author.avatarURL()}`)
                .setTimestamp()

            message.react("⛔");
            message.reply({ embeds: [kickEmbedMsg] })
        } else if (args[0].startsWith("<@!")) {
            let id = args[0].replace("<@!", "");
            id = id.replace(">", "");

            let mmbr = await client.users.fetch(id).catch((error) => {
                console.log(`${error.name}: ${error.message}`)
                const kickEmbedMsg = new MessageEmbed()
                    .setColor(`FF0000`)
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                    .setTitle(`An error occured`)
                    .setDescription(`Couldn't kick <@${id}> because they do not exist.`)
                    .setFooter(`Unkown User | ${id}`, `https://media.discordapp.net/attachments/779794636595658772/920707062567149608/gGWDJSghKgd8QAAAABJRU5ErkJggg.png`)
                    .setTimestamp()

                message.react("⛔");
                message.reply({ embeds: [kickEmbedMsg] })
            });

            if (mmbr) {
                const kickEmbedMsg = new MessageEmbed()
                    .setColor(`FF0000`)
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, `${message.author.avatarURL()}`)
                    .setTitle(`An error occured`)
                    .setDescription(`Couldn't kick <@${mmbr.id}> because they're not on this server.`)
                    .setFooter(`${mmbr.username} | ${mmbr.id}`, `${mmbr.avatarURL()}`)
                    .setTimestamp()

                message.react("⛔");
                message.reply({ embeds: [kickEmbedMsg] })
            } else {
                return;
            }
        }
    }
}