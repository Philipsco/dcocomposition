const Bots = require('./app/sysoBot.js')
const express = require('express')
const cors = require("cors")
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

app.get("/oasing", async (req, res) => {
  try {
    const result = await sysoBot.getDoneFollowup();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})
app.use(cors())
app.use(express.json())
app.post("/oasing", async (req, res) => {
  try {
    const { data } = req.body

    if(data === true || data === "true") {
      const result = await sysoBot.postFollowup(true)
      return res.status(200).json(result);
    } else if (data === false || data === "false") {
      const result = await sysoBot.postFollowup(false)
      return res.status(200).json(result);
    } else {
      console.log(`${data} bukan boolean (?)`)
      return res.status(400).json({ success: false, message: "Data harus true / false" });
    }


    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

app.listen(port, ()=>{
  console.log(`cli-nodejs-api listening at ${port}`)
})

main()