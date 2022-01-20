const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const guildSchema = mongoose.Schema({
    guildID: reqString,
    guildName: reqString,
    guildPrefix: reqString
})

module.exports = mongoose.model('guilds', guildSchema)