const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqInt = {
    type: Number,
    required: true
}

const guildSchema = mongoose.Schema({
    docID: reqInt,
    guildID: reqString,
    guildName: reqString,
    guildPrefix: reqString,
    guildVolume: reqString
})

module.exports = mongoose.model('guilds', guildSchema)