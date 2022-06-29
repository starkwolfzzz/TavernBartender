    
    const { MessageEmbed } = require('discord.js');

    module.exports = {
        name: "whitelist",
        description: "Adds or removes someone from the minecraft whitelist",
        options: [{
                name: "type",
                description: "Whether to add or remove the user",
                choices: [{
                        name: "add",
                        value: "add"
                    },
                    {
                        name: "remove",
                        value: "remove"
                    },
                ],
                type: "STRING",
                required: true
            },
            {
                name: "user",
                description: "The member to whitelist",
                type: "USER",
                required: true
            },
            {
                name: "name",
                description: "The name to whitelist",
                type: "STRING",
                required: true
            },
        ],
        default_member_permissions: "0",
        async execute(client, interaction) {
            var type = interaction.options.getString("type");
            const embed = new MessageEmbed()
                .setColor('#ff9414')
                .setTitle(`Adding ${interaction.options.getString('name')} to the whitelist`)
                .setDescription(`Adding <@${interaction.options.getUser('user').id}> to the whitelist as ${interaction.options.getString('name')}`)
                .addFields({ name: 'Function', value: 'Change Whitelist', inline: true }, { name: 'Type', value: 'Add user', inline: true }, )
                .addField('Value', `<@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')}`, true)
                .setTimestamp();

            if (type == "add") {
                interaction.reply({ embeds: [embed] })
                const message = await interaction.fetchReply();
                if (message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).roles.cache.find(role => role.name === "whitelisted") == undefined) {
                    embed.fields[0] = { name: 'Timer', value: 'Please wait 10 seconds...' };
                    embed.fields[1] = { name: 'Function', value: 'Change Whitelist', inline: true };
                    embed.fields[2] = { name: 'Type', value: 'Add user', inline: true };
                    embed.fields[3] = { name: 'Value', value: `<@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')}`, inline: true };
                    interaction.editReply({ embeds: [embed] })
                    var whitelistMsg;
                    message.guild.channels.cache.find(channel => channel.name === "console").send(`whitelist list`)
                    var secs = 10;

                    var changeTimer = setInterval(function() {
                        secs--;
                        embed.fields[0] = { name: 'Timer', value: `Please wait ${secs} seconds...` }
                        interaction.editReply({ embeds: [embed] })
                        if (secs == 0) clearInterval(changeTimer);
                    }, 1000);

                    setTimeout(() => {
                        message.guild.channels.cache.find(channel => channel.name === "console").messages.fetch({ limit: 10 }).then(messages => {
                                for (i = 0; i < messages.map(m => m.content).reverse().length; i++) {
                                    msg = messages.map(m => m.content).reverse()[i];
                                    const splitLines = str => str.split(/\r?\n/);
                                    for (s = 0; s < splitLines(msg).length; s++) {
                                        line = splitLines(msg)[s];
                                        if (line.includes("whitelisted players")) {
                                            whitelistMsg = line;
                                        }

                                        if (i == messages.map(m => m.content).length - 1) {
                                            if (s == splitLines(msg).length - 1) {
                                                foundList()
                                            }
                                        }
                                    }
                                }
                            })
                            .catch(console.error);

                        function foundList() {
                            if (whitelistMsg.includes(interaction.options.getString('name'))) {
                                embed
                                    .setTitle(`${interaction.options.getString('name')} is already whitelisted!`)
                                    .setColor("RED")
                                    .setDescription(`⛔ Couldn't add <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} to the whitelist as they're already whitelisted.`)
                                    .setTimestamp()
                                    .setFields()
                                interaction.editReply({ embeds: [embed] })
                            } else {
                                message.guild.channels.cache.find(channel => channel.name === "console").send(`whitelist add ${interaction.options.getString("name")}`)
                                message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).setNickname(interaction.options.getString("name")).catch(error => {
                                    if (error.code !== 10008) {
                                        console.error('Failed to perform action:', error.name, ":", error.message);
                                    }
                                });
                                message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).roles.add(interaction.guild.roles.cache.find(role => role.name === "whitelisted"));
                                embed
                                    .setTitle(`${interaction.options.getUser('user').username} has been whitelisted!`)
                                    .setColor("GREEN")
                                    .setDescription(`✅ Added <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} to the whitelist successfully.`)
                                    .setTimestamp()
                                    .setFields()
                                interaction.editReply({ embeds: [embed] })
                            }
                        }
                    }, secs * 1000);
                } else {
                    embed
                        .setTitle(`${interaction.options.getUser('user').username} is already whitelisted!`)
                        .setColor("RED")
                        .setDescription(`⛔ Couldn't add <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} to the whitelist as they're already whitelisted.`)
                        .setTimestamp()
                        .setFields()
                    interaction.editReply({ embeds: [embed] })
                }
            } else {
                embed.setTitle(`Removing ${interaction.options.getString('name')} from the whitelist`)
                    .setDescription(`Removing <@${interaction.options.getUser('user').id}> to the whitelist as ${interaction.options.getString('name')}`)
                interaction.reply({ embeds: [embed] })
                const message = await interaction.fetchReply();
                if (message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).roles.cache.find(role => role.name === "whitelisted") != undefined) {
                    embed.fields[0] = { name: 'Timer', value: 'Please wait 10 seconds...' };
                    embed.fields[1] = { name: 'Function', value: 'Change Whitelist', inline: true };
                    embed.fields[2] = { name: 'Type', value: 'Remove user', inline: true };
                    embed.fields[3] = { name: 'Value', value: `<@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')}`, inline: true };
                    interaction.editReply({ embeds: [embed] })
                    var whitelistMsg;
                    message.guild.channels.cache.find(channel => channel.name === "console").send(`whitelist list`)
                    var secs = 10;

                    var changeTimer = setInterval(function() {
                        secs--;
                        embed.fields[0] = { name: 'Timer', value: `Please wait ${secs} seconds...` }
                        interaction.editReply({ embeds: [embed] })
                        if (secs == 0) clearInterval(changeTimer);
                    }, 1000);

                    setTimeout(() => {
                        message.guild.channels.cache.find(channel => channel.name === "console").messages.fetch({ limit: 10 }).then(messages => {
                                for (i = 0; i < messages.map(m => m.content).reverse().length; i++) {
                                    msg = messages.map(m => m.content).reverse()[i];
                                    const splitLines = str => str.split(/\r?\n/);
                                    for (s = 0; s < splitLines(msg).length; s++) {
                                        line = splitLines(msg)[s];
                                        if (line.includes("whitelisted players")) {
                                            whitelistMsg = line;
                                        }

                                        if (i == messages.map(m => m.content).length - 1) {
                                            if (s == splitLines(msg).length - 1) {
                                                foundList()
                                            }
                                        }
                                    }
                                }
                            })
                            .catch(console.error);

                        function foundList() {
                            if (whitelistMsg.includes(interaction.options.getString('name'))) {
                                message.guild.channels.cache.find(channel => channel.name === "console").send(`whitelist remove ${interaction.options.getString("name")}`)
                                message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).setNickname("").catch(error => {
                                    if (error.code !== 10008) {
                                        console.error('Failed to perform action:', error.name, ":", error.message);
                                    }
                                });
                                message.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id).roles.remove(interaction.guild.roles.cache.find(role => role.name === "whitelisted"));
                                embed
                                    .setTitle(`${interaction.options.getUser('user').username} has been removed from the whitelist!`)
                                    .setColor("GREEN")
                                    .setDescription(`✅ Removed <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} from the whitelist successfully.`)
                                    .setTimestamp()
                                    .setFields()
                                interaction.editReply({ embeds: [embed] })
                            } else {
                                embed
                                    .setTitle(`${interaction.options.getString('name')} is not whitelisted!`)
                                    .setColor("RED")
                                    .setDescription(`⛔ Couldn't remove <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} from the whitelist as they're already not whitelisted.`)
                                    .setTimestamp()
                                    .setFields()
                                interaction.editReply({ embeds: [embed] })
                            }
                        }
                    }, 10000);
                } else {
                    embed
                        .setTitle(`${interaction.options.getUser('user').username} is not whitelisted!`)
                        .setColor("RED")
                        .setDescription(`⛔ Couldn't remove <@${interaction.options.getUser('user').id}> as ${interaction.options.getString('name')} from the whitelist as they're already not whitelisted.`)
                        .setTimestamp()
                        .setFields()
                    interaction.editReply({ embeds: [embed] })
                }
            }
        }
    }