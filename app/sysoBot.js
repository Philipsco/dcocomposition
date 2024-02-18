const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, shiftTime, invalidCommand, panduanText, greetText, hadirText, fullTeamA, fullTeamB, fullTeamC, fullTeamD} = require("../config/constant.js")
const today = new Date().toDateString();

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

      getGenerate() {
        this.onText(commands.generate, (data) => {
            this.sendMessage(data.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
                reply_markup: {
                    inline_keyboard: groupBCA
                }
            })
        })

        this.on("callback_query", callback => {
            const callbackNameGroup = callback.data
            const id = callback.from.id
            switch (callbackNameGroup){
                case "A":
                    generateKomposisi(id, callbackNameGroup)
                    break
                case "B":
                    generateKomposisi(id, callbackNameGroup)
                    break
                case "C":
                    generateKomposisi(id, callbackNameGroup)
                    break
                case "D":
                    generateKomposisi(id, callbackNameGroup)
                    break
            }
        })

        const generateKomposisi = (id, grup) => {
            this.sendMessage(id, "Shift Berapa ka ??", {
                reply_markup: {
                    inline_keyboard: shiftTime
                }
            })
    
            this.on("callback_query", callbacks => {
                const datas = callbacks.data;
                this.sendMessage(id, hadirText).then(() => {
                    this.onText(commands.fullTeam, (data) => {
                        const ids = data.from.id
                        switch(grup){
                            case  'A':
                                this.sendMessage(id, `${today}\nBerikut #KomposisiGroupA Shift ${datas} :${fullTeamA}`)
                                break
                            case 'B':
                                this.sendMessage(id, `Dear All, \n\nBerikut #KomposisiGroupB Shift ${datas} pada ${today} :${fullTeamB}`)
                                break
                            case  'C':
                                this.sendMessage(id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${datas} pada ${today} :${fullTeamC}`)
                                break
                            case 'D':
                                this.sendMessage(id, `${today}\n Shift ${datas} #Grup${grup} :${fullTeamD}`)
                                break
                            default:
                                this.sendMessage(id, "System Error")
                                break
                        }
                    })
                })

                

                this.onText(commands.halfTeam, (data) => {
                    this.sendMessage(data.from.id, `Group ${grup} Shift ${datas}`)
                })
            })

            return
        }
      }

}

module.exports = SysoBot;