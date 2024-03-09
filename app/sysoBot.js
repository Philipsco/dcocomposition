const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, shiftTime, invalidCommand, panduanText, greetText, hadirText, fullTeamA, fullTeamB, fullTeamC, fullTeamD} = require("../config/constant.js");
const {checkTime,checkCommands} = require("../utils/utility.js")
const {db} = require('../config/conn.js')
const today = checkTime()
let dataGenerate =[]
class SysoBot extends TelegramBot {
    constructor(token, options) {
        super(token, options);
        // checkCommands(this)
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
            const apiCall = await fetch(quoteEndpoint);
            const { quote } = await apiCall.json();
    
            this.sendMessage(data.from.id, `${today}\nQuotes kamu pada hari ini adalah\n\n${quote}`);
          } catch (e) {
            console.error(err);
            this.sendMessage(data.from.id, "maaf silahkan ulangi lagi 🙏")
            this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
          }
        });
    }

    getHelp() {
        this.onText(commands.help, (data) => {
          this.sendMessage(data.from.id, panduanText);
        });
    }

    getEathquake() {
        this.onText(commands.quake, async (data) => {
            const id = data.from.id
            const bmkg_endpoint = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json'
            this.sendMessage(id, "mohon ditunggu rekan seperjuangan...")
            try {
                const api = await fetch(bmkg_endpoint)
                const response = await api.json()
                const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = response.Infogempa.gempa
                const image = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`

                const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
                this.sendPhoto(id, image, { caption: result })
            } catch (e) {
                this.sendMessage(data.from.id,"Gagal memuat data berita, silahkan coba lagi 😢")
                this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
            }
        })
    }

    generateKeterangan(){
        let dataSakit,dataIzin,dataCuti

        this.onText(commands.sick, (data, after) => {
            dataSakit = after[1].toUpperCase()
            const [...sakit] = dataSakit.split(",")
            dataSakit = sakit
        })

        this.onText(commands.izin, (data, after) => {
            dataIzin = after[1].toUpperCase()
            const [...izin] = dataIzin.split(",")
            dataIzin = izin
        })

        this.onText(commands.onLeave, (data, after) => {
            dataCuti = after[1].toUpperCase()
            const [...cuti] = dataCuti.split(",")
            dataCuti = cuti
        })
        console.log(dataSakit)
        console.log(dataIzin)
        console.log(dataCuti)
        // this.sendMessage(data.from.id, `${today}\nBerikut #KomposisiGroup${dataGenerate[0]} Shift ${dataGenerate[1]} :${fullTeamA}`)
    }

    getGenerate() {
      try {
          this.onText(commands.generate, (data) => {
            this.sendMessage(data.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
                  reply_markup: {
                      inline_keyboard: groupBCA
                  }
              })
          })

          this.on("callback_query", callback => {
              this.sendMessage(callback.from.id, shiftTime)
              dataGenerate.push(callback.data)
            })

            this.onText(commands.shiftOne, data => {
                dataGenerate.push(1)
                this.sendMessage(data.from.id, hadirText) 
                console.log(dataGenerate)
            })

            this.onText(commands.shiftTwo, data => {
                dataGenerate.push(2)
                this.sendMessage(data.from.id, hadirText) 
                console.log(dataGenerate)
            })

            this.onText(commands.shiftThree, data => {
                dataGenerate.push(3)
                this.sendMessage(data.from.id, hadirText) 
                console.log(dataGenerate)
            })

            this.onText(commands.fullTeam, data => {
                let grup = dataGenerate[0]
                let shift = dataGenerate[1]
                switch (grup) {
                    case 'A':
                        this.sendMessage(data.from.id, `${today}\nBerikut #KomposisiGroup${grup} Shift ${shift} :${fullTeamA}`)
                        dataGenerate.splice(0,dataGenerate.length)
                        console.log(dataGenerate)
                        break
                    case 'B':
                        this.sendMessage(data.from.id, `Dear All, \n\nBerikut #KomposisiGroup${grup} Shift ${shift} pada ${checkTime()} :${fullTeamB}`) 
                        dataGenerate.splice(0,dataGenerate.length)
                        console.log(dataGenerate)
                        break
                    case 'C':
                        this.sendMessage(data.from.id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${shift} pada ${checkTime()} :${fullTeamC}`)
                        dataGenerate.splice(0,dataGenerate.length)
                        console.log(dataGenerate)
                        break
                    case 'D':
                        this.sendMessage(data.from.id, `${today}\n Shift ${shift} #Grup${grup} :${fullTeamD}`)
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                    default:
                        this.sendMessage(data.from.id, "System Error")
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                }
            })

            this.onText(commands.halfTeam, data => {
                let grup = dataGenerate[0]
                let shift = dataGenerate[1]
                switch (grup) {
                    case 'A':
                        this.sendMessage(data.from.id, "Masukkan data")
                        this.generateKeterangan()
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                    case 'B':
                        this.sendMessage(data.from.id, `Dear All, \n\nBerikut #KomposisiGroup${grup} Shift ${shift} pada ${checkTime()} :${fullTeamB}`) 
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                    case  'C':
                        this.sendMessage(data.from.id, `Dear All, \n\nBerikut Komposisi Personil #Group${grup} Shift ${shift} pada ${checkTime()} :${fullTeamC}`)
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                    case 'D':
                        this.sendMessage(data.from.id, `${today}\n Shift ${shift} #Grup${grup} :${fullTeamD}`)
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                    default:
                        this.sendMessage(data.from.id, "System Error")
                        dataGenerate.splice(0,dataGenerate.length)
                        break
                }
            })
      } catch (error) {
          console.log(error)
      }
    }

    async getDate() {
        let dateNow = await db.query('SELECT * FROM dataKaryawan')
        console.log(dateNow) // <---  the result of running query
    }

    async insertDatabase() {
        await this.onText(commands.insertDb, async data => {
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin diinput dengan format sebagai berikut.\n\n[inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
            await this.on('message', async (data) => {
                const [inisial, grup, role, sites] = data.text.split(",")
    
                const res = await db.query("INSERT INTO dataKaryawan (inisial, grup, role, sites) VALUES ($1, $2,$3,$4)", [inisial, grup, role, sites])
                console.log(res)
                this.sendMessage(data.from.id, `inisial ${inisial} berhasil ditambahkan pada database kami`)
            })
        
        })

        
    }

    async updateDatabase(){
        await this.onText(commands.updateDb, data => {
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin di update dengan format sebagai berikut.\n\n[inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
        })
    }

    async deleteDatabase(){
        await this.onText(commands.deleteDb, async data => {
            this.sendMessage(data.from.id, "Silahkan masukan inisial yang ingin di hapus")

            await this.on('message', async (data) => {
                const inisial = data.text
                const res = await db.query("DELETE FROM dataKaryawan WHERE inisial=$1",[inisial])
                if (!res) return this.sendMessage(data.from.id,"Data tidak ditemukan")
                this.sendMessage(data.from.id,"Berhasil menghapus data")
            })
        })

        
    }
}

module.exports = SysoBot;