const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
});

module.exports = {
    name: "weather",
    description: "Gets the weather of a specific location",
    options: [{
        name: "location",
        description: "The location to get weather for",
        type: "STRING",
        required: true
    }, ],
    async execute(client, interaction) {
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${interaction.options.getString('location')}/today?unitGroup=metric&elements=conditions%2Chumidity%2Ccloudcover%2Cvisibility%2Cdescription%2Cicon%2Cdatetime%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslikemax%2Cfeelslikemin%2Cfeelslike%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Csnow%2Csnowdepth%2Cwindspeed%2Cwinddir%2Cuvindex&include=days%2Cfcst%2Cevents%2Calerts&key=${process.env.WEATHER_KEY}&iconSet=icons2&contentType=json`, {
            "method": "GET",
            "headers": {}})
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            response.json().then(async content => {
                // console.log(content);
                const msgEmbed = new MessageEmbed();
                var loc = content.resolvedAddress;
                var longitude = content.longitude;
                var latitude = content.latitude;
                var timezone = content.timezone;
                var tzoffeset = content.tzoffset;
                data = content.days[0];
                var date = data.datetime;
                var temp = {
                    'normal': data.temp, 
                    'min': data.tempmin, 
                    'max': data.tempmax,
                    'humidity': data.humidity,
                };
                var feelsLike = {
                    'normal': data.feelslike,
                    'min': data.feelslikemin,
                    'max': data.feelslikemax
                }
                var precip = {
                    'mm': data.precip,
                    'prob%': data.precipprob,
                    'cover%': data.precipcover,
                }

                let filePath = "../../json/weather_colors.json";

                var jsonColors = require(filePath);
                var desc = data.description;
                var conditions = data.conditions;
                var icon = data.icon;
                var iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${icon}.png`;
                var color = jsonColors[`${icon}`];

                var Alerts = [];
                for(i = 0; i < content.alerts.length; i++){
                    var alert = content.alerts[i];
                    onsetTime = new Date(alert.onsetEpoch *1000);
                    endTime = new Date(alert.endsEpoch *1000);
                    options = {
                        'weekday': 'short',
                        'hour12': true,
                        'day': 'numeric',
                        'month': 'short',
                        'year': 'numeric',
                        'timezoneName': 'shortOffset',
                        'hour': '2-digit',
                        'minute': '2-digit'
                    };
                    Alerts.push({
                        'link': alert.link,
                        'event': alert.event,
                        'headline': alert.headline,
                        'desc': alert.description,
                        'onsetTime': `${onsetTime.toLocaleString('en-GB', options)}`,
                        'endTime': `${endTime.toLocaleString('en-GB', options)}`,
                        'id': alert.id,
                        'language': languageNames.of(alert.language)
                    })
                }
                
                var snow = {
                    'thicknesscm': data.snow,
                    'depthcm': data.snowdepth
                }

                var wind = {
                    'speedkph': data.windspeed,
                    'dirdegrees': data.winddir,
                    'cloud': data.cloudcover,
                    'visibility': data.visibility
                }

                var uvIndex = data.uvindex;

                msgEmbed.setTitle(`Weather Forecast for Today`)
                .setDescription(`**TL;DR**: ${conditions}\n${desc}\n`)
                .addFields({
                    name: '🌍 Location',
                    value: `__Longitude__: ${longitude}\n__Latitude__: ${latitude}\n__Timezone__: ${timezone} (GMT${(tzoffeset < 0) ? tzoffeset : '+' + tzoffeset})`,
                    inline: true
                },
                {
                    name: '🌡️ Temperature',
                    value: `Current: ${temp.normal}°C (feels like ${feelsLike.normal}°C)\nHighest: ${temp.max}°C (feels like ${feelsLike.max}°C)\nLowest: ${temp.min}°C (feels like ${feelsLike.min}°C)\nHumidity: ${temp.humidity}%\nUV Index: ${uvIndex}`,
                    inline: true
                });

                if(precip.mm > 0){
                    msgEmbed.addFields({
                        name: `💧 Precipitation`,
                        value: `Amount: ${precip.mm} mm\nProbability: ${precip['prob%']}%\nCover Area: ${precip['cover%']}%`,
                        inline: true
                    });
                }

                if(snow.depthcm > 0){
                    msgEmbed.addFields({
                        name: '❄️ Snow',
                        value: `Thickness: ${snow.thicknesscm} cm\nDepth: ${snow.depthcm} cm`,
                        inline: true
                    });
                }

                msgEmbed.addFields({
                    name: '💨 Wind \& Fog',
                    value: `Speed: ${wind.speedkph} km/hr\nDirection: ${wind.dirdegrees}°\nCloud Cover: ${wind.cloud}%\nVisiblity: ${wind.visibility} km`,
                    inline: true
                });

                for(i = 0; i < Alerts.length; i++){
                    msgEmbed.addFields({
                        name: `⚠️ ${convertToTitleCase(Alerts[i].event)}`,
                        value: `${Alerts[i].desc} Starts on ${Alerts[i].onsetTime} and ends on ${Alerts[i].endTime}.\n[Source](${Alerts[i].link}) (ID: ${Alerts[i].id}) (${Alerts[i].language})`
                    });
                }

                msgEmbed.addFields({
                    name: 'Source',
                    value: `Information obtained from [Visual Crossing](${encodeURI(`https://www.visualcrossing.com/weather-forecast/${content.address}/metric`)}).`
                });

                msgEmbed.setTimestamp().setColor(`${color}`).setFooter({
                    text: `${loc}`,
                    // iconURL: `${iconUrl}`
                }).setImage(iconUrl);

                interaction.reply({ embeds: [msgEmbed]})
            });   
        })
        .catch(err => {
            var errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`❌ | An unknown error occurred.\n\`${err}\``)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        });
    }
}

function convertToTitleCase(str) {
    if (!str) {
        return ""
    }
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }