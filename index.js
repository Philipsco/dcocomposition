const TelegramBot = require('node-telegram-bot-api');
const botToken = '6536468269:AAGk0uIERxD2SXfMqznQYdrxLHRqqOvZrLg';
const bot = new TelegramBot(botToken, { polling: true });
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const {db}=require("../dcocomposition/firebase")

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the SysoBot!\nHow can I assist you?\nPossible use cases:\n\/todo: for appending to a todolist\n\/idea: for random ideas\n\/thoughts: for deep thoughts\n\/blog: for adding blog titles\n\/showtodo: to show todolist\n\/done: to remove item from todolist\n\/showtitles to show all blog titles');
});
  