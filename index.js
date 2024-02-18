const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const {db}=require("../dcocomposition/firebase.js")
const TelegramBot = require('node-telegram-bot-api');
const env = require("dotenv")
env.config()

const botToken = process.env.BOT_TOKEN
const bot = new TelegramBot(botToken, { polling: true });

const CMD_A = "A";
const CMD_B = "B";
const CMD_C = "C";
const CMD_D = "D";
const SHIFT1 = 1;
const SHIFT2 = 2;
const SHIFT3 = 3;
let var1,var2;

let shiftTime = [[
  {
    text: "Shift 1",
    callback_data: SHIFT1
  },
  {
    text: "Shift 2",
    callback_data: SHIFT2
  }
], [
  {
    text: "Shift 3",
    callback_data: SHIFT3
  }
]];

let groupBCA = [
  [
    {
      text: "A",
      callback_data: CMD_A
    },
    {
      text: "B",
      callback_data: CMD_B
    }
  ],[
    {
      text: "C",
      callback_data: CMD_C
    },
    {
      text: "D",
      callback_data: CMD_D
    }
  ]];

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the SysoBot!\nHow can I assist you?\nPossible use cases:\n\/generate: for generate today standby team\n\/test: for random ideas\n');
  });

bot.onText(/\/generate/, (msg) => {
  const {chat: {id}} = msg;
    bot.sendMessage(id, 'Halo, saya adalah SysoBot yang baik hati dan tidak sombong, ', {
      "reply_markup": {
        "inline_keyboard": groupBCA
      }
    });
    bot.on('callback_query', query => {
      const {message: {chat, message_id, text}= {}} = query
      switch(query.data){
        case CMD_A : {
          bot.sendMessage(chat.id, CMD_A)
          bot.sendMessage(chat.id, "Masuk Shift apa nih ka kalau boleh tahu yaa", {
            "reply_markup": {
              "inline_keyboard": shiftTime
            }
          })
          bot.on('callback_query',queuee => {
            const {message: {chat, message_id, text}= {}} = queuee
            switch (queuee.data){
              case SHIFT1:
                bot.sendMessage(chat.id, SHIFT1)
                break
            }
          })
          break;
        }
      }
    })
});


// bot.on('callback_query', query=> {
//   const {message: {chat, message_id, text}= {}} = query
//   switch(query.data){
//     case CMD_A : 
//     bot.sendMessage(chat.id, "Masuk Shift apa nih ka kalau boleh tahu yaa", {
//       "reply_markup": {
//         "inline_keyboard": shiftTime
//       }
//     })
//     break;
//   }
//   bot.answerCallbackQuery({
//     callback_query_id: query.id
//   })
  
// })

bot.on('message', async (msg) => {
  const botProfile = await bot.getMe()
  var sakit = "sakit";
  let data = msg.text.toString().substring(6)
  let data1 = data.split(",")
  
  bot.sendMessage(msg.chat.id, `Perkenalkan saya adalah ${botProfile.first_name}`)
  if (msg.text.toString().toLowerCase().includes(sakit)) {
    for (let index = 0; index < data1.length; index++) {
      const element = data1[index];
     bot.sendMessage(msg.chat.id, "Data yang sakit " + element);
    }
  }
  
  });

  bot.onText(/\/follow(.*)/, (data, after) => {
    bot.sendMessage(data.from.id, `${after[1]}`)
  })