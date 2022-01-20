const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Clears a certain amount of messages",
    async execute(client, message, args) {
        const msgEmbed = new MessageEmbed()
            .setColor("F9A602")
            .setTimestamp()

        var amount = parseInt(args[0]);
        var actualAmount = 0;
        const channel = message.channel;

        if (message.guild.members.cache.find(m => m.id === client.user.id).permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (amount > 100) {
                var loop = Math.ceil((amount / 100));
                for (i = 0; i < loop; i++) {
                    if (amount <= 100) {
                        const msgs = await channel.messages.fetch({ limit: amount });
                        if ((Date.now() - msgs.last().createdTimestamp) < 12096e5) {
                            const size = msgs.size;
                            channel.bulkDelete(amount);
                            actualAmount += size;
                            msgEmbed.setDescription(`Cleared ${actualAmount} messages`)
                            channel.send({ embeds: [msgEmbed] }).then(msgT => {
                                setTimeout(async() => {
                                    var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                    if (msgg) msgT.delete();
                                }, 10000);
                            });
                        } else {
                            const msgss = await lots_of_messages_getter(channel, amount)
                            const size = msgss.length;
                            var cur = 0;
                            msgss.forEach(msg => {
                                msg.delete().then(() => {
                                    actualAmount += 1;
                                    cur++;
                                    if (cur == size) {
                                        msgEmbed.setDescription(`Cleared ${actualAmount} messages`)
                                        message.reply({ embeds: [msgEmbed] }).then(msgT => {
                                            setTimeout(async() => {
                                                var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                                if (msgg) msgT.delete();

                                                var msggg = await channel.messages.fetch(message.id).catch(() => { return false });
                                                if (msggg) message.delete();
                                            }, 10000);
                                        });
                                    }
                                });
                            });
                        }
                    } else {
                        const msgs = await channel.messages.fetch({ limit: 100 });
                        if (msgs.size < 100) {
                            if ((Date.now() - msgs.last().createdTimestamp) < 12096e5) {
                                const size = msgs.size;
                                actualAmount += size;
                                channel.bulkDelete(msgs.size);
                                msgEmbed.setDescription(`Cleared ${actualAmount} messages`)
                                channel.send({ embeds: [msgEmbed] }).then(msgT => {
                                    setTimeout(async() => {
                                        var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                        if (msgg) msgT.delete();
                                    }, 10000);
                                });
                            } else {
                                const msgss = await lots_of_messages_getter(channel, msgs.size)
                                const size = msgss.length;
                                var cur = 0;
                                msgss.forEach(msg => {
                                    msg.delete().then(() => {
                                        actualAmount += 1;
                                        cur++;
                                        if (cur == size) {
                                            msgEmbed.setDescription(`Cleared ${actualAmount} messages`)
                                            message.reply({ embeds: [msgEmbed] }).then(msgT => {
                                                setTimeout(async() => {
                                                    var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                                    if (msgg) msgT.delete();

                                                    var msggg = await channel.messages.fetch(message.id).catch(() => { return false });
                                                    if (msggg) message.delete();
                                                }, 10000);
                                            });
                                        }
                                    });
                                });
                            }
                            break;
                        } else {
                            amount -= 100;
                            if ((Date.now() - msgs.last().createdTimestamp) < 12096e5) {
                                const size = msgs.size;
                                actualAmount += size;
                                channel.bulkDelete(100);
                            } else {
                                const msgss = await lots_of_messages_getter(channel, amount, msgs.last().id)
                                const size = msgss.length;
                                var cur = 0;
                                msgss.forEach(msg => {
                                    msg.delete().then(() => {
                                        actualAmount += 1;
                                        cur++;
                                        if (cur == size) {
                                            msgEmbed.setDescription(`Cleared ${actualAmount} messages`)
                                            message.reply({ embeds: [msgEmbed] }).then(msgT => {
                                                setTimeout(async() => {
                                                    var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                                    if (msgg) msgT.delete();

                                                    var msggg = await channel.messages.fetch(message.id).catch(() => { return false });
                                                    if (msggg) message.delete();
                                                }, 10000);
                                            });
                                        }
                                    });
                                });
                                break;
                            }
                        }
                    }
                }

            } else {
                const msgs = await channel.messages.fetch({ limit: amount });
                if ((Date.now() - msgs.last().createdTimestamp) < 12096e5) {
                    const size = msgs.size;
                    channel.bulkDelete(amount);
                    msgEmbed.setDescription(`Cleared ${size} messages`)
                    channel.send({ embeds: [msgEmbed] }).then(msgT => {
                        setTimeout(async() => {
                            var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                            if (msgg) msgT.delete();
                        }, 10000);
                    });
                } else {
                    const msgss = await lots_of_messages_getter(channel, amount);
                    const size = msgss.length;
                    var cur = 0;
                    msgss.forEach(msg => {
                        msg.delete().then(() => {
                            cur++;
                            if (cur == size) {
                                msgEmbed.setDescription(`Cleared ${size} messages`)
                                message.reply({ embeds: [msgEmbed] }).then(msgT => {
                                    setTimeout(async() => {
                                        var msgg = await channel.messages.fetch(msgT.id).catch(() => { return false });
                                        if (msgg) msgT.delete();

                                        var msggg = await channel.messages.fetch(message.id).catch(() => { return false });
                                        if (msggg) message.delete();
                                    }, 10000);
                                });
                            }
                        });
                    });
                }
            }

            /*var cur = 0;
            messages.forEach(msg => {
                msg.delete().then(() => {
                    cur++;
                    if (cur == size) {
                        msgEmbed.setDescription(`Cleared messages`)
                        message.reply({ embeds: [msgEmbed] }).then(msgT => {
                            setTimeout(() => {
                                if(await channel.messages.fetch(message.id))
                                if(await channel.messages.fetch(msgT.id)) msgT.delete();
                            }, 10000);
                        });
                    }
                });
            });*/

            async function lots_of_messages_getter(channel, limit, lastid = message.id) {
                var sum_messages = [];
                let last_id = lastid;

                while (true) {
                    const options = {};
                    if (limit >= 100) options.limit = 100;
                    else options.limit = limit;
                    if (last_id) {
                        options.before = last_id;
                    }

                    const messages = await channel.messages.fetch(options);
                    messages.forEach(msg => {
                        sum_messages.push(msg);
                    });
                    last_id = messages.last().id;

                    if (messages.size != 100 || sum_messages.length >= limit) {
                        break;
                    }
                }

                return sum_messages;
            }
        } else {
            const errorEmbedMsg = new MessageEmbed()
                .setColor(`FF0000`)
                .setTitle(`An error occured`)
                .setDescription(`Couldn't delete ${amount} messages because I don't have permission to delete messages.`)
                .setFooter(`${client.user.username}#${client.user.id}`, `${client.user.avatarURL()}`)
                .setTimestamp()

            message.react("⛔");
            message.reply({ embeds: [errorEmbedMsg] })
        }
    }
}