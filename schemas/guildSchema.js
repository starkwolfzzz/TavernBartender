const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildSchema = mongoose.Schema({
    guildID: reqString,
    guildName: reqString,
    guildPrefix: reqString,
    guildVolume: reqString
})

module.exports = mongoose.model('guilds', guildSchema)