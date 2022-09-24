const guildSchema = require("../../../schemas/guildSchema");
const config = require("../../../config.json");
const { Client } = require(`discord.js`);
const express = require("express");
const app = express();
const port = 25623;

var errors = "";

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   * @returns
   */
  async execute(client) {
    var type = "streaming";
    client.user.setStatus("online");
    client.user.setActivity("with @Stark Wolfz#9300", {
      type: type.toUpperCase(),
      url: "https://twitch.tv/starkwolfzz",
    });

    if (client.devMode) {
      var type = "playing";
      client.user.setStatus("idle");
      client.user.setActivity("Under Development!", {
        type: `${type.toUpperCase()}`,
      });
    }

    //Slash commands
    topBars = 60;
    console.log(" " + insertChar("_", (topBars - 1)));
    console.log(
      "|" +
        insertChar(
          " ",
          Math.round((topBars - 1 - `Updated Guilds`.length) / 2)
        ) +
        "Updated Guilds" +
        insertChar(
          " ",
          Math.floor((topBars - 1 - `Updated Guilds`.length) / 2)
        ) +
        "|"
    );
    console.log("|" + insertChar("_", topBars - 1) + "|");
    console.log("|" + insertChar(" ", topBars - 1) + "|");

    //Delete guilds that the bot isn't on anymore
    var deleted = false;
    var docCount = await guildSchema.countDocuments();
    var x = 0;
    for (i = 0; i < docCount; i++) {
      if (
        (await guildSchema.find({ docID: i }))[0] &&
        !client.guilds.cache.get(
          (await guildSchema.find({ docID: i }))[0].guildID
        )
      ) {
        guildSchema.findOneAndDelete({ docID: i }).then(() => (deleted = true));
      }
    }

    if (deleted) {
      client.guilds.cache.forEach(async (guild) => {
        x = x + 1;
        await guildSchema.updateOne(
          {
            guildID: guild.id,
          },
          {
            docID: x - 1,
          }
        );
      });
    }

    var bar = new Promise(async (resolve, reject) => {
      var size = client.guilds.cache.size;
      for (p = 0; p < size; p++) {
        const mainGuild = client.devMode ? client.guilds.cache.get(process.env["GUILD_ID"]) : (client.guilds.cache.get(
          client.guilds.cache.map((guild) => guild.id)[p]
        ));

        if(client.devMode) {
          p = size - 1;
        }
        
        //Check if guild exists on database
        var searchById = guildSchema.find({
          guildID: mainGuild.id,
        });

        var queryResult = (await searchById)[0];

        if (queryResult.length == 0) {
          const guild = {
            docID: await guildSchema.countDocuments(),
            guildID: mainGuild.id,
            guildName: mainGuild.name,
            guildPrefix: config.prefix,
            guildVolume: config.volume,
            guildPlayChannelType: config.playChannelType
          };

          await new guildSchema(guild).save();
        }

        //Check if guild name changed on database
        if (queryResult.guildName != mainGuild.name) {
          await guildSchema.updateOne(
            {
              guildID: mainGuild.id,
            },
            {
              guildName: mainGuild.name,
            }
          );
        }

        //Check if the already existing guilds have a value for the new field
        if(queryResult.guildPlayChannelType == undefined){
          await guildSchema.updateOne(
            {
              guildID: mainGuild.id,
            },
            {
              guildPlayChannelType: config.playChannelType,
            }
          );
        }


        await mainGuild.commands.set(client.slashCommands).then((cmd) => {
            const Roles = (commandName) => {
              const cmdPerms = client.slashCommands.find(
                (c) => c.name === commandName
              ).Perms;

              if (!cmdPerms) return null;

              return mainGuild.roles.cache.filter(
                (r) => r.permissions.has(cmdPerms) && !r.managed
              );
            };

            var guildName = mainGuild.name;

            if(mainGuild.name.length > (topBars-2)){
              guildName = mainGuild.name.substring(0, 54) + "...";
            }

            var neededSpace1 = ((topBars - 1 - guildName.length) / 2) === 1/2 ? (Math.floor((topBars - 1 - guildName.length) / 2)) : (Math.round((topBars - 1 - guildName.length) / 2));
            var neededSpace2 = Math.floor(
              (topBars - 1 - guildName.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[32m" +
                guildName +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
          }).catch((error) => {
            var guildName = mainGuild.name;
            
            errors += error;
            var neededSpace1 = (((topBars - 1 - guildName.length) / 2) === 1) ? (Math.floor((topBars - 1 - guildName.length) / 2)) : (Math.round((topBars - 1 - guildName.length) / 2));
            var neededSpace2 = Math.floor(
              (topBars - 1 - guildName.length) / 2
            );
            console.log(
              "|" +
                insertChar(" ", neededSpace1) +
                "\x1b[31m" +
                guildName +
                "\x1b[0m" +
                insertChar(" ", neededSpace2) +
                "|"
            );
          });

          if(p == (size - 1)) resolve();
      }
    });

    bar.then(() => {
      console.log("|" + insertChar(" ", topBars - 1) + "|");
      console.log(" " + insertChar("‾", (topBars - 1)));

      console.info(
        `\x1b[33m${client.user.tag} \x1b[0mis \x1b[32m${client.user.presence.status} \x1b[0mand is \x1b[35m${type} ${client.user.presence.activities[0]}\x1b[0m`
      );
      app.get("/", (req, res) =>
        res.send(
          `${client.user.tag} is ${client.user.presence.status} and is ${type} ${client.user.presence.activities[0]}`
        )
      );
      app.listen(port /*, () => console.log(`app listening at http://localhost:${port}`)*/ );

      if (errors != "") console.log(errors);

      if (client.devMode)
        console.info("Development Mode is \x1b[32mEnabled\x1b[0m!");
    });

    function insertChar(char, frequency) {
      var num = 1;
      var c = char;
      for (i = 1; i < frequency; i++) {
        c += char;
        num++;
      }
      return c;
    }
  },
};
