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
    limit: 100
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

  app.use(cors())
  app.use(express.json())
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store")
    next()
  })
  app.get("/health", (req, res) => {
    res.sendStatus(200)
  })
  app.get("/oasing", async (req, res) => {
    try {
      const result = await sysoBot.getDoneFollowup()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  })
  app.post("/oasing", async (req, res) => {
    try {
      const { data } = req.body
      if(data === true || data === "true") {
        const result = await sysoBot.postFollowup(true)
        return res.status(200).json(result)
      } else if (data === false || data === "false") {
        const result = await sysoBot.postFollowup(false)
        return res.status(200).json(result)
      } else {
        console.log(`${data} bukan boolean (?)`)
        return res.status(400).json({ success: false, message: "Data harus true / false" })
      }
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  })
  app.listen(port, ()=>{
    console.log(`listening at ${port}`)
  })

   app.post("/webhook", async (req, res) => {
    const powerAutomateUrl = "https://default59daf1404aee4b7780f44ea8bec86c.2e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ed6d4b3ae5304135868d88512af89f56/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HjMKmUsXeoI0tzUisGN_tSCJMsR2E24R_wI80AVSSD8";
    try {
      const response = await fetch(powerAutomateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
     res.json({
      status: "success",
      forwarded: result
    });

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
   })
}

main()
