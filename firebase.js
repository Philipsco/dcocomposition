const {initializeApp, cert}= require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")

const serviceAccount=require("../dcocomposition/sysobot-firebase-adminsdk-uhhfz-509c6f5b13.json")

initializeApp({
 credential:cert(serviceAccount)
})

const db= getFirestore()
module.exports={ db }