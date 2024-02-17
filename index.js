const TelegramBot = require('node-telegram-bot-api');
const botToken = '6536468269:AAGk0uIERxD2SXfMqznQYdrxLHRqqOvZrLg';
const bot = new TelegramBot(botToken, { polling: true });
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const {db}=require("../dcocomposition/firebase.js")

const CMD_A = "A";
const CMD_B = "B";
const CMD_C = "C";
const CMD_D = "D";
const SHIFT1 = 1;
const SHIFT2 = 2;
const SHIFT3 = 3;
let var1 = [];
let var2 = null;

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
    bot.sendMessage(chatId, 'Halo, saya adalah SysoBot yang baik hati dan tidak sombong, ', {
      "reply_markup": {
        "inline_keyboard": groupBCA
      }
    });
});


bot.on('callback_query', query=> {
  const {message: {chat, message_id, text}= {}} = query
  switch(query.data){
    case CMD_A : 
    bot.sendMessage(x.id, "Masuk Shift apa nih ka kalau boleh tahu yaa", {
      "reply_markup": {
        "inline_keyboard": shiftTime
      }
    })
    break;
  }
})