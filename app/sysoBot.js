const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, shiftTime, invalidCommand, panduanText, greetText, hadirText, fullTeamA, fullTeamB, fullTeamC, fullTeamD} = require("../config/constant.js");
const {checkTime} = require("../utils/utility.js")
const today = checkTime()
class SysoBot extends TelegramBot {
    constructor(token, options) {
        super(token, options);
        this.on("message", (data) => {
            const isInCommand = Object.values(commands).some((keyword) => keyword.test(data.text));
        if(!isInCommand){
            this.sendMessage(data.from.id, invalidCommand, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                            text : "Panduan Penggunaan",
                            callback_data: "panduan_pengguna"
                            }
                        ]
                    ]
                }
            })
        }
        });

        this.on('callback_query', callback => {
            const callbackName = callback.data
            if(callbackName === "panduan_pengguna"){
                this.sendMessage(callback.from.id, panduanText)
            }
        })
    }

    getGreeting() {
        this.onText(commands.start, (data) => {
          this.sendMessage(data.chat.id, greetText);
        });
    }
    getQuotes() {
        this.onText(commands.quote, async (data) => {
          const quoteEndpoint = "https://api.kanye.rest/";
          try {
            // ambil data quotes dari internet kak yang lain jangan dijadiin edit, non edit aja (yang copy paste jadi error wkwk)
            const apiCall = await fetch(quoteEndpoint);
            const { quote } = await apiCall.json();
    
            this.sendMessage(data.from.id, `quotes hari ini untuk kamu ${quote}`);
          } catch (err) {
            console.error(err);
            this.sendMessage(data.from.id, "maaf silahkan ulangi lagi 🙏");
          }
        });
    }

    getHelp() {
        this.onText(commands.help, (data) => {
          this.sendMessage(data.from.id, panduanText);
        });
    }

    generate (id, grup) {
        this.sendMessage(id, shiftTime)

        this.onText(commands.shiftOne, data => {
        this.sendMessage(data.from.id, hadirText) 
        this.generateKomposisi(grup,1)
    })
    this.onText(commands.shiftTwo, data => {
        this.sendMessage(data.from.id, hadirText)
        this.generateKomposisi(grup,2)
    })
    this.onText(commands.shiftThree, data => {
        this.sendMessage(data.from.id, hadirText)
        this.generateKomposisi(grup,3) 
    })

    }

    generateKomposisi (grup,shift) {
        this.onText(commands.fullTeam, data => {
            switch (grup) {
                case 'A':
                    this.sendMessage(data.from.id, `${today}\nBerikut #KomposisiGroup${grup} Shift ${shift} :${fullTeamA}`)
                    break
                case 'B':
                    this.sendMessage(data.from.id, `Dear All, \n\nBerikut #KomposisiGroup${grup} Shift ${shift} pada ${checkTime()} :${fullTeamB}`) 
                    break
                case  'C':
                    this.sendMessage(data.from.id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${shift} pada ${checkTime()} :${fullTeamC}`)
                    break
                case 'D':
                    this.sendMessage(data.from.id, `${today}\n Shift ${shift} #Grup${grup} :${fullTeamD}`)
                    break
                default:
                    this.sendMessage(data.from.id, "System Error")
                    break
            }
        })
        
        this.onText(commands.halfTeam, data => {
            switch (grup) {
                case 'A':
                    this.sendMessage(id, `${today}\nBerikut #KomposisiGroup${grup} Shift ${shift} :${fullTeamA}`)
                    break
                case 'B':
                    this.sendMessage(id, `Dear All, \n\nBerikut #KomposisiGroup${grup} Shift ${shift} pada ${checkTime()} :${fullTeamB}`) 
                    break
                case  'C':
                    this.sendMessage(id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${shift} pada ${checkTime()} :${fullTeamC}`)
                    break
                case 'D':
                    this.sendMessage(id, `${today}\n Shift ${shift} #Grup${grup} :${fullTeamD}`)
                    break
                default:
                    this.sendMessage(id, "System Error")
                    break
            }
        })
    }

    getGenerate(){
        try {
            this.onText(commands.generate, (callback) => {
                //console.log(callback)
                this.sendMessage(callback.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
                    reply_markup: {
                        inline_keyboard: groupBCA
                    }
                })
            })

            this.on("callback_query", (dataGrup)=> {
                const grup  = dataGrup.data
                const chatId = dataGrup.from.id
                switch (dataGrup.data) {
                    case 'A':
                        this.generate(chatId, grup)
                        break;
                    case 'B':
                        this.generate(chatId, grup)
                        break;
                    case 'C':
                        this.generate(chatId, grup)
                        break;
                    case 'D':
                        this.generate(chatId, grup)
                        break;
                    default:
                        break;
                }

            })
            
        } catch (err) {
            console.log(err)
            bot.on('polling_error', (error) => {
                console.error('Polling error:', error);
            });
        }
    }

    // getGenerate() {
    //     const generateKomposisi = (id, grup) => {
    //         this.sendMessage(id, "Shift Berapa ka ??", {
    //             reply_markup: {
    //                 inline_keyboard: shiftTime
    //             }
    //         })
        
    //         this.on("callback_query", callbacks => {
    //             const datas = callbacks.data;
    //             console.log(callbacks)
    //             this.sendMessage(callbacks.from.id, hadirText)
    //             this.onText(commands.fullTeam, (data) => {
    //                 const ids = data.from.id
    //                 const chatID = data.chat.id
    //                 const messageId = data.message_id
    //                 switch(grup){
    //                     case  'A':
    //                         this.sendMessage(callbacks.from.id, `${checkTime()}\nBerikut #KomposisiGroupA Shift ${datas} :${fullTeamA}`)
    //                         this.deleteMessage(chatID,messageId )
    //                         break
    //                     case 'B':
    //                         this.sendMessage(callbacks.from.id, `Dear All, \n\nBerikut #KomposisiGroupB Shift ${datas} pada ${checkTime()} :${fullTeamB}`)
    //                         this.deleteMessage(chatID,messageId)
    //                         break
    //                     case  'C':
    //                         this.sendMessage(callbacks.from.id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${datas} pada ${checkTime()} :${fullTeamC}`)
    //                         this.deleteMessage(chatID,messageId)
    //                         break
    //                     case 'D':
    //                         this.sendMessage(callbacks.from.id, `${checkTime()}\n Shift ${datas} #Grup${grup} :${fullTeamD}`)
    //                         this.deleteMessage(chatID,messageId)
    //                         break
    //                     default:
    //                         this.sendMessage(callbacks.from.id, "System Error")
    //                         break
    //                 }
    //             })
    //             this.onText(commands.halfTeam, (data) => {
    //                 this.sendMessage(data.from.id, `Group ${grup} Shift ${datas}`)
    //             })
    //         })
    //     }
    //   try {
    //       this.onText(commands.generate, (data) => {
    //           this.sendMessage(data.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
    //               reply_markup: {
    //                   inline_keyboard: groupBCA
    //               }
    //           })
    //       })

    //       this.on("callback_query", callback => {
    //           const callbackNameGroup = callback.data
    //           const id = callback.from.id
    //           switch (callbackNameGroup){
    //               case "A":
    //                   generateKomposisi(id, callbackNameGroup)
    //                   break
    //               case "B":
    //                   generateKomposisi(id, callbackNameGroup)
    //                   break
    //               case "C":
    //                   generateKomposisi(id, callbackNameGroup)
    //                   break
    //               case "D":
    //                   generateKomposisi(id, callbackNameGroup)
    //                   break
    //           }
    //       })
    //   } catch (error) {
    //       console.log(error)
    //   }
      
    // }

}

module.exports = SysoBot;