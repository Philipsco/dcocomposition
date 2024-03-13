const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, shiftTime, invalidCommand, panduanText, greetText, hadirText, fullTeamA, fullTeamB, fullTeamC, fullTeamD, failedText, dataRandom} = require("../config/constant.js");
const {checkTime,checkCommands} = require("../utils/utility.js")
const {db} = require('../config/conn.js')
const today = checkTime()
const bmkg_endpoint = 'https://data.bmkg.go.id/DataMKG/TEWS/'
let dataGenerate =[]
let dumpGempa
class SysoBot extends TelegramBot {
    constructor(token, options) {
        super(token, options);
        checkCommands(this)
    }

    async checkAndInsertDbUserId(userId, name){
        try {
            const res = await db.query("SELECT * FROM dataUserIDs WHERE userId=$1",[userId])
            console.log(res.rows)
            if(res.rows[0]=== undefined) {
                const resp = db.query("INSERT INTO dataUserIDs (userId, userName) VALUES ($1, $2)", [userId, name])
                return false
            } else {
                return true
            }
        } catch (e) {
            this.sendMessage(data.from.id, failedText)
            this.sendMessage(936687738,`${e} pada saat check dan insert db pada userid`)
        }
        
    }

    getGreeting() {
        this.onText(commands.start, async (data) => {
          await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
          this.sendMessage(data.chat.id, greetText)
        })
    }

    getQuotes() {
        this.onText(commands.quote, async (data) => {
            this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
          const quoteEndpoint = "https://api.kanye.rest/";
          try {
            const apiCall = await fetch(quoteEndpoint);
            const { quote } = await apiCall.json();
    
            this.sendMessage(data.from.id, `${today}\nQuotes kamu pada hari ini adalah\n\n${quote}`);
          } catch (e) {
            console.error(err);
            this.sendMessage(data.from.id, failedText)
            this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
          }
        });
    }

    getHelp() {
        this.onText(commands.help, (data) => {
          this.sendMessage(data.from.id, panduanText)
          this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
        });
    }

    getEathquake() {
        this.onText(commands.quake, async (data) => {
            const id = data.from.id
            this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
            const bmkg = bmkg_endpoint+'autogempa.json'
            this.sendMessage(id, "mohon ditunggu rekan seperjuangan...")
            try {
                const api = await fetch(bmkg)
                const response = await api.json()
                const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = response.Infogempa.gempa
                const image = `${bmkg_endpoint}${Shakemap}`
                if (dumpGempa===Tanggal) {
                    this.sendMessage(data.from.id,"Info Gempa masih sama")
                } else {
                    dumpGempa = Tanggal
                    const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
                    this.sendPhoto(id, image, { caption: result })
                }
            } catch (e) {
                this.sendMessage(data.from.id, failedText)
                this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
            }
        })
    }

    async sendInfoGempaAuto (){
        const duration = 1 * 30 * 1000
        let numberSelected = 0
        setInterval(async () => {
            const bmkg = bmkg_endpoint+'autogempa.json'
            const res = await db.query("SELECT userid FROM dataUserIDs")
            const count = res.rowCount
            let data = res.rows
            if (count > 0) {
                const api = await fetch(bmkg)
                const response = await api.json()
                const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = response.Infogempa.gempa
                const image = `${bmkg_endpoint}${Shakemap}`
                for(let x = 0; x < count; x++){
                    let userId = data[x].userid
                    try {
                        if (dumpGempa===undefined) {
                            console.log(dumpGempa===undefined)
                            const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
                            this.sendPhoto(userId, image, { caption: result })
                        } else{
                            numberSelected++
                        }
                    } catch (e) {
                        this.sendMessage(userId, failedText)
                    }
                }
                dumpGempa = Tanggal
            } else {
                clearInterval(duration)
            }
        }, duration)
    }

    async getGenerate() {
        let dataSakit,dataIzin,dataCuti
        let dumpUser = 123
      try {
          this.onText(commands.generate, (data) => {
            this.sendMessage(data.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
                  reply_markup: {
                      inline_keyboard: groupBCA
                  }
              })
            dumpUser = data.from.id
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

            this.onText(commands.sick, (data, after) => {
                dataSakit = after[1].toUpperCase()
                const [...sakit] = dataSakit.split(",")
                dataSakit = sakit
                this.sendMessage(data.from.id, `data sakit inisial ${dataSakit} berhasil ditambahkan`)
            })
    
            this.onText(commands.izin, (data, after) => {
                dataIzin = after[1].toUpperCase()
                const [...izin] = dataIzin.split(",")
                dataIzin = izin
                this.sendMessage(data.from.id, `data izin inisial ${dataIzin} berhasil ditambahkan`)
            })
    
            this.onText(commands.onLeave, async (data, after) => {
                dataCuti = after[1].toUpperCase()
                const [...cuti] = dataCuti.split(",")
                dataCuti = cuti
                this.sendMessage(data.from.id, `data cuti inisial ${dataCuti} berhasil ditambahkan`)
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

            this.onText(commands.halfTeam, async data => {
                this.sendMessage(data.from.id, "Masukkan data sakit,izin dan cuti")
            })

            setInterval(async() => {
                if(dataCuti != undefined && dataIzin != undefined && dataSakit != undefined && dataGenerate[0] != undefined && dataGenerate[1] != undefined){
                    this.sendMessage(dumpUser, `Dear All\nBerikut #KomposisiGroup${dataGenerate[0]} Shift ${dataGenerate[1]} pada ${today} :${await this.getGrup(dataSakit,dataIzin,dataCuti)}\n\nBest Regards,\nGroup ${dataGenerate[0]}`)
                    dataGenerate.splice(0,dataGenerate.length)
                    dataCuti.splice(0,dataCuti.length)
                    dataIzin.splice(0,dataIzin.length)
                    dataSakit.splice(0,dataSakit.length)
                }
            }, 1*30*1000)
            
      } catch (error) {
          console.log(error)
          this.sendMessage(data.from.id,failedText)
          this.sendMessage(936687738,`${e} dengan command /generate`)
          dataGenerate.splice(0,dataGenerate.length)
          dataCuti.splice(0,dataCuti.length)
          dataIzin.splice(0,dataIzin.length)
          dataSakit.splice(0,dataSakit.length)
      }
    }

    async getGeneratePantun(){
        this.onText(commands.generatePantun, async (data) => {
            const pantunEndpoint = "https://rima.rfnaj.id/api/v1/pantun/karmina"
            let x = Math.floor(Math.random() * (dataRandom.length));
            const request = {
                'isi': dataRandom[x]
            }

            try {
                const apiCall = await fetch(pantunEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, plain/text'
                    },
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(request)
                })

                apiCall.json().then(saa => {
                    console.log(saa)
                    this.sendMessage(data.from.id, `${today}\nPantun kamu pada hari ini adalah\n\n${saa.sampiran}\n${saa.isi}`)
                })
                
              } catch (e) {
                console.error(e);
                this.sendMessage(data.from.id, failedText)
                this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
              }
        })
    }

    async getInisial(inisial){
        let res = await db.query("SELECT * FROM dataKaryawan WHERE inisial= $1", [inisial])
        return res.rows[0] === undefined ? false : true
    }

    insertDatabase() {
        this.onText(commands.insertDb, data => {
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin diinput dengan format sebagai berikut.\n\n[inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
        })

        this.onText(commands.insert, async (data, after) => {
            const [inisial, grup, role, sites] = after[1].split(",")
            const leader = true  
            const checkInisial = await this.getInisial(inisial)
            try {
                if (checkInisial === true) {
                    this.sendMessage(data.from.id, `inisial ${inisial} sudah ada pada database kami`)
                } else {
                    const res = await db.query("INSERT INTO dataKaryawan (inisial, grup, role, leader, sites) VALUES ($1, $2,$3,$4, $5)", [inisial, grup, role, leader, sites])
                    console.log(res)
                    this.sendMessage(data.from.id, `inisial ${inisial} berhasil ditambahkan pada database kami`)
                } 
            } catch (error) {
                this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
            }  
        })
    }

    async updateDatabase(){
        await this.onText(commands.updateDb, data => {
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin di update dengan format sebagai berikut.\n\n[inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
        })
    }

    async deleteDatabase(){
        this.onText(commands.deleteDb, async data => {
            this.sendMessage(data.from.id, "Silahkan masukan inisial yang ingin di hapus")
        })

        await this.onText(commands.delete, async (data, after) => {
            const inisial = after[1]
            const checkInisial = await this.getInisial(inisial)
            if (checkInisial === true) {
                db.query("DELETE FROM dataKaryawan WHERE inisial=$1",[inisial])
                this.sendMessage(data.from.id,"Berhasil menghapus data")
            } else {
                this.sendMessage(data.from.id,"data tidak ditemukan rekan")
            }
        })
    }

    async getGrup(sakit,izin,cuti){
        let mbcasyso =[]
        let mbcadcmon = []
        let mbcasl = []
        let mbcasoc = []
        let wsasyso =[]
        let wsadcmon = []
        let wsasl = []
        let wsasoc = []
        let gassyso =[]
        let gasdcmon = []
        let gassl = []
        let gassoc = []
        let gacfoc =[]
        let gacsl = []
        let gacsyso = []
        let gacdcmon = []
        let gacsoc = []
        let grup = dataGenerate[0]
        const resgrup = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND NOT(inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4))", [grup, sakit,izin,cuti])
        const resKeterangan = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND (inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4))", [grup, sakit,izin,cuti])
        try {
            for(let x=0; x<resgrup.rows.length; x++){
                let pushData = resgrup.rows[x].inisial
                switch (resgrup.rows[x].sites) {
                    case 'MBCA':
                        switch (resgrup.rows[x].role) {
                            case 'SYSO':
                                resgrup.rows[x].leader === true ? mbcasyso.push(pushData+ ` (TL)`): mbcasyso.push(pushData)
                                break;
                            case 'DCMon':
                                resgrup.rows[x].leader === true ? mbcadcmon.push(pushData+ ` (TL)`): mbcadcmon.push(pushData)
                                break;
                            case 'SL':
                                mbcasl.push(pushData+ ` (SL)`)
                                break;
                            case 'SOC':
                                mbcasoc.push(pushData)
                                break;
                            default:
                                break;
                        }
                        break;
    
                    case 'WSA2':
                        switch (resgrup.rows[x].role) {
                            case 'SYSO':
                                resgrup.rows[x].leader === true ? wsasyso.push(pushData+ ` (TL)`): wsasyso.push(pushData)
                                break;
                            case 'DCMon':
                                resgrup.rows[x].leader === true ? wsadcmon.push(pushData+ ` (TL)`): wsadcmon.push(pushData)
                                break;
                            case 'SL':
                                wsasl.push(pushData+ ` (SL)`)
                                break;
                            case 'SOC':
                                wsasoc.push(pushData)
                                break;
                            default:
                                break;
                        }
                        break;
    
                    case 'GAS':
                        switch (resgrup.rows[x].role) {
                            case 'SYSO':
                                resgrup.rows[x].leader === true ? gassyso.push(pushData+ ` (TL)`): gassyso.push(pushData)
                                break;
                            case 'DCMon':
                                resgrup.rows[x].leader === true ? gasdcmon.push(pushData+ ` (TL)`): gasdcmon.push(pushData)
                                break;
                            case 'SL':
                                gassl.push(pushData+ ` (SL)`)
                                break;
                            case 'SOC':
                                gassoc.push(pushData)
                                break;
                            default:
                                break;
                        }
                        break;
    
                    case 'GAC':
                        switch (resgrup.rows[x].role) {
                            case 'SYSO':
                                resgrup.rows[x].leader === true ? gacsyso.push(pushData+ ` (TL)`): gacsyso.push(pushData)
                                break;
                            case 'DCMon':
                                resgrup.rows[x].leader === true ? gacdcmon.push(pushData+ ` (TL)`): gacdcmon.push(pushData)
                                break;
                            case 'SL':
                                gacsl.push(pushData+ ` (SL)`)
                                break;
                            case 'SOC':
                                resgrup.rows[x].leader === true ? gacsoc.push(pushData+ ` (TL)`): gacsoc.push(pushData)
                                break;
                            case 'FOC':
                                gacfoc.push(pushData)
                                break;
                            default:
                                break;
                        }
                        break;
                
                    default:
                        break;
                }
            }

            let format =`
#MBCA
Hadir : ${mbcasl}, Syso [${mbcasyso}], DCMon [${mbcadcmon}], SOC [${mbcasoc}]
Tidak Hadir : 

#WSA2
Hadir : ${wsasl}, Syso [${wsasyso}], DCMon [${wsadcmon}], SOC [${wsasoc}]
Tidak Hadir :

#GAS
Hadir : ${gassl}, Syso [${gassyso}], DCMon [${gasdcmon}], SOC [${gassoc}]
Tidak Hadir :

#GAC
Hadir : ${gacsl}, FOC [${gacfoc}]
Tidak Hadir : 
`
        return format
        } catch (error) {
            this.sendMessage(936687738,`${error} pada saat generate getGroup()`)
        }

    }
    
}

module.exports = SysoBot;