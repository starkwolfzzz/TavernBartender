

module.exports = {
    name: "tempmute",
    description: "/tempmute {user} {time} {reason}",
    options: [{
            name: "user",
            description: "The member to temp mute",
            type: "USER",
            required: true
        },
        {
            name: "time",
            description: "The time of the temp mute",
            type: "STRING",
            required: true
        },
        {
            name: "unit",
            description: "The unit of time for the temp mute",
            type: "STRING",
            choices: [{
                    name: "seconds",
                    value: "seconds"
                },
                {
                    name: "minutes",
                    value: "minutes"
                },
                {
                    name: "hours",
                    value: "hours"
                },
                {
                    name: "days",
                    value: "days"
                },
                {
                    name: "months",
                    value: "months"
                },
                {
                    name: "years",
                    value: "years"
                },
            ],
            required: true
        },
        {
            name: "reason",
            description: "The reason of the temp mute",
            type: "STRING",
            required: false
        },
    ],
    default_member_permissions: "0",
    async execute(client, interaction) {
        var reason = "";
        if (interaction.options.getString(reason) != null) reason = "because " + interaction.options.getString('reason');
        interaction.reply({ content: `Muted <@${interaction.options.getUser('user').id}> for ${interaction.options.getString('time')} ${interaction.options.getString('unit')} ${reason}` })
        const user = interaction.guild.members.cache.find(user => user.id === interaction.options.getUser('user').id);
        var str = user.roles.cache.map(role => role.name).join(", ");
        var roles = str.split(", ");
        roles.forEach(rol => {
            if (rol != "@everyone" && !user.roles.cache.find(role => role.name === rol).managed) {
                user.roles.remove(interaction.guild.roles.cache.find(role => role.name === rol));
            }
        });
        user.roles.add(interaction.guild.roles.cache.find(role => role.name === "muted"));

        var time = interaction.options.getString('time');

        switch (interaction.options.getString("unit")) {
            case "seconds":
                timer = time;
                break;
            case "minutes":
                timer = time * 60;
                break;
            case "hours":
                timer = time * 60 * 60;
                break;
            case "days":
                timer = time * 60 * 60 * 24;
                break;
            case "weeks":
                timer = time * 60 * 60 * 24 * 7;
                break;
            case "months":
                timer = time * 60 * 60 * 24 * 7 * 4;
                break;
        }

        setTimeout(() => {
            user.roles.remove(interaction.guild.roles.cache.find(role => role.name === "muted"));
            roles.forEach(rol => {
                if (rol != "@everyone" && !user.roles.cache.find(role => role.name === rol) || !user.roles.cache.find(role => role.name === rol).managed) user.roles.add(interaction.guild.roles.cache.find(role => role.name === rol));
            });
            interaction.editReply({ content: `Unmuted <@${interaction.options.getUser('user').id}>` })
        }, time * 1000);
    }
}