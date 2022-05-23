module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        const role = member.guild.roles.cache.find(role => role.name === "normie member 69420");
        if (role) member.roles.add(role)
    
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === "welcome");
        if (welcomeChannel) await welcomeChannel.send(`<@${member.id}> just joined this server, very cool gamer`)
    },
};