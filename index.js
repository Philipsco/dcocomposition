const Bots = require('./app/sysoBot.js')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
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
  // sysoBot.sendInfoGempaAuto()
  sysoBot.getGeneratePantun()
  sysoBot.deleteKomposisi()
}

app.get("/health", (req, res) => {
  res.sendStatus(200)
})

app.use(express.json());
app.get("/oasing", async (req, res) => {
  try {
    const result = await sysoBot.getDoneFollowup();
    res.sendStatus(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post("/oasing", async (req, res) => {
  try {
    const { data } = req.body
    await sysoBot.postFollowup(data)
    res.status(200)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(port, ()=>{
  console.log(`cli-nodejs-api listening at ${port}`)
})

main()