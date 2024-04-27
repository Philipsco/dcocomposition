const Bots = require('./app/sysoBot.js')
const express = require('express')
const app = express()
const env = require("dotenv")
env.config()

const botToken = process.env.BOT_TOKEN
const sysoBot = new Bots(botToken, {polling: {
  params: {
    limit: 1,
    offset: 2
  }
}});

const main = () => {
  sysoBot.getGreeting()
  sysoBot.getQuotes()
  sysoBot.getHelp()
  sysoBot.getGenerate()
  sysoBot.insertDatabase()
  sysoBot.deleteDatabase()
  sysoBot.updateDatabase()
  sysoBot.getEathquake()
  sysoBot.sendInfoGempaAuto()
  sysoBot.getGeneratePantun()
  sysoBot.sendPing()
  sysoBot.deleteKomposisi()
}

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

main()