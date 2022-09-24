require("dotenv").config();

const { MessageEmbed } = require("discord.js");
const guildSchema = require("../../../schemas/guildSchema");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot) return;

    if (message.channel.type === "DM") return;

    const searchById = guildSchema.find({
      guildID: message.guild.id
    })

    var prefix = (await searchById)[0].guildPrefix;

    if (message.content.startsWith(prefix)) return;

    const { content, channel, guild, member } = message;

    var voiceChannel = member.voice.channel;

    var guildOnDatabase = (await guildSchema.find({ guildID: guild.id }))[0];

    var playChannelType = guildOnDatabase.guildPlayChannelType;

    switch (message.channel.name) {
      case "play":
        switch (playChannelType) {
          case "URL":
            if (
              message.content.startsWith("https://") ||
              message.content.startsWith("http://")
            ) {
              if (
                message.content.includes("youtu.be") ||
                message.content.includes("youtube.com") ||
                message.content.includes("spotify.com")
              ) {
                if (!voiceChannel) {
                  var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `❌ | You must be in a voice channel to use music commands.`
                    );
                  return message.reply({ embeds: [errorEmbed] });
                }

                if (
                  guild.me.voice.channelId &&
                  voiceChannel.id !== guild.me.voice.channelId
                ) {
                  var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `❌ | I'm already playing music in <#${guild.me.voice.channelId}>.`
                    );
                  return interaction.reply({ embeds: [errorEmbed] });
                }

                try {
                  message.reply({
                    content: `☑️ | Adding ${content} to the queue.`,
                  });
                  client.distube
                    .play(voiceChannel, content, {
                      textChannel: channel,
                      member: member,
                    })
                    .then(async () => {
                      await client.distube.setVolume(
                        guild.id,
                        parseInt(guildOnDatabase.guildVolume)
                      );
                    })
                    .catch((e) => {
                      var errorEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(
                          `❌ | An Unexpected Error Occured: ${e
                            .toString()
                            .slice(0, 4000)}`
                        );

                      console.log(e);
                      return message.reply({ embeds: [errorEmbed] });
                    });
                } catch (e) {
                  var errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `❌ | An Unexpected Error Occured: ${e
                        .toString()
                        .slice(0, 4000)}`
                    );

                  console.log(e);
                  return message.reply({ embeds: [errorEmbed] });
                }
              }
            }
            break;
          case "ALL":
            if (!voiceChannel) {
              var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                  `❌ | You must be in a voice channel to use music commands.`
                );
              return message.reply({ embeds: [errorEmbed] });
            }

            if (
              guild.me.voice.channelId &&
              voiceChannel.id !== guild.me.voice.channelId
            ) {
              var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                  `❌ | I'm already playing music in <#${guild.me.voice.channelId}>.`
                );
              return interaction.reply({ embeds: [errorEmbed] });
            }

            try {
              message.reply({
                content: `☑️ | Adding ${content} to the queue.`,
              });
              client.distube
                .play(voiceChannel, content, {
                  textChannel: channel,
                  member: member,
                })
                .then(async () => {
                  await client.distube.setVolume(
                    guild.id,
                    parseInt(guildOnDatabase.guildVolume)
                  );
                });
            } catch (e) {
              var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(
                  `❌ | An Unexpected Error Occured: ${e
                    .toString()
                    .slice(0, 4000)}`
                );

              console.log(e);
              return message.reply({ embeds: [errorEmbed] });
            }
            break;
          case "NONE":
            break;
        }
        break;
    }
  },
};
