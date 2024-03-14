const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, shiftTime, panduanText, greetText, hadirText, failedText, dataRandom, formatData} = require("../config/constant.js");
const {checkTime,checkCommands} = require("../utils/utility.js")
const {db} = require('../config/conn.js')
const today = checkTime()
const bmkg_endpoint = 'https://data.bmkg.go.id/DataMKG/TEWS/'
let dataGenerate =[]
let dumpGempaDate, dumpGempaTime
class SysoBot extends TelegramBot {
    constructor(token, options) {
        super(token, options);
        checkCommands(this)
    }

    async checkAndInsertDbUserId(userId, name){
        try {
            const res = await db.query("SELECT * FROM dataUserIDs WHERE userId=$1",[userId])
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
          const quoteEndpoint = "https://api.kanye.rest/"
          try {
            const apiCall = await fetch(quoteEndpoint)
            const { quote } = await apiCall.json()
    
            this.sendMessage(data.from.id, `${today}\nQuotes kamu pada hari ini adalah\n\n${quote}`)
          } catch (e) {
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
                const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
                this.sendPhoto(id, image, { caption: result })
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
                        if (dumpGempaDate !== Tanggal && dumpGempaTime !== Jam) {
                            const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
                            this.sendPhoto(userId, image, { caption: result })
                        } else{
                            numberSelected++
                        }
                    } catch (e) {
                        this.sendMessage(userId, failedText)
                    }
                }
                dumpGempaDate = Tanggal
                dumpGempaTime = Jam
            } else {
                clearInterval(duration)
            }
        }, duration)
    }

    getGenerate() {
        let dataSakit=[]
        let dataIzin= []
        let dataCuti=[]
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
            })

            this.onText(commands.shiftTwo, data => {
                dataGenerate.push(2)
                this.sendMessage(data.from.id, hadirText)
            })

            this.onText(commands.shiftThree, data => {
                dataGenerate.push(3)
                this.sendMessage(data.from.id, hadirText)
            })

            this.onText(commands.sick, (data, after) => {
                dataSakit = after[1].toUpperCase()
                const [...sakit] = dataSakit.split(",")
                dataSakit = sakit
                this.sendMessage(data.from.id, `data sakit inisial ${dataSakit} berhasil ditambahkan`).then(() => {
                    this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang cuti jika tidak ada dapat mencantumkan - \nContoh : cuti pbk,gng atau cuti -\nFormat : cuti [inisial]`)
                })
            })
    
            this.onText(commands.izin, (data, after) => {
                dataIzin = after[1].toUpperCase()
                const [...izin] = dataIzin.split(",")
                dataIzin = izin
                this.sendMessage(data.from.id, `data izin inisial ${dataIzin} berhasil ditambahkan`).then(() => {
                    this.sendMessage(data.from.id, `Processing Data....`).then(async() => {
                    this.sendMessage(data.from.id, `Dear All\nBerikut #KomposisiGroup${dataGenerate[0]} Shift ${dataGenerate[1]} pada ${today} :\n${await this.getGrup(dataSakit,dataIzin,dataCuti)}\nBest Regards,\nGroup ${dataGenerate[0]}`)
                    for (let x = 0; x < dataGenerate.length; x++) {
                        dataGenerate.splice(x,dataGenerate.length)
                        break
                    }
                    for (let x = 0; x < dataCuti.length; x++) {
                        dataCuti.splice(x,dataCuti.length)
                        break
                    }
                    for (let x = 0; x < dataIzin.length; x++) {
                        dataIzin.splice(x,dataIzin.length)
                        break
                    }
                    for (let x = 0; x < dataSakit.length; x++) {
                        dataSakit.splice(x,dataSakit.length)
                        break
                    }
                    })
                })
            })
    
            this.onText(commands.onLeave, async (data, after) => {
                dataCuti = after[1].toUpperCase()
                const [...cuti] = dataCuti.split(",")
                dataCuti = cuti
                this.sendMessage(data.from.id, `data cuti inisial ${dataCuti} berhasil ditambahkan`).then(() => {
                    this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang izin jika tidak ada dapat mencantumkan - \nContoh : izin pbk,alj atau izin -\nFormat : izin [inisial]`)
                })
            })

            this.onText(commands.fullTeam, async data => {
                let grup = dataGenerate[0]
                let shift = dataGenerate[1]
                this.sendMessage(data.from.id, `Dear All\nBerikut #KomposisiGroup${grup} Shift ${shift} pada ${today} :\n${await this.getGrup([],[],[])}\nBest Regards,\nGroup ${grup}`)
                for (let x = 0; x < dataGenerate.length; x++) {
                    dataGenerate.splice(x,dataGenerate.length)
                    break
                }
                for (let x = 0; x < dataCuti.length; x++) {
                    dataCuti.splice(x,dataCuti.length)
                    break
                }
                for (let x = 0; x < dataIzin.length; x++) {
                    dataIzin.splice(x,dataIzin.length)
                    break
                }
                for (let x = 0; x < dataSakit.length; x++) {
                    dataSakit.splice(x,dataSakit.length)
                    break
                }
            })

            this.onText(commands.halfTeam, async data => {
                this.sendMessage(data.from.id, "Masukkan inisial yang sedang sakit jika tidak ada dapat mencantumkan - \nContoh : sakit pbk,fkh atau sakit -\nFormat : sakit [inisial]")
            })
      } catch (error) {
        this.sendMessage(data.from.id,failedText)
        this.sendMessage(936687738,`${error} dengan command /generate`)
        for (let x = 0; x < dataGenerate.length; x++) {
            dataGenerate.splice(x,dataGenerate.length)
            break
        }
        for (let x = 0; x < dataCuti.length; x++) {
            dataCuti.splice(x,dataCuti.length)
            break
        }
        for (let x = 0; x < dataIzin.length; x++) {
            dataIzin.splice(x,dataIzin.length)
            break
        }
        for (let x = 0; x < dataSakit.length; x++) {
            dataSakit.splice(x,dataSakit.length)
            break
        }
      }
    }

    getGeneratePantun(){
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
                    this.sendMessage(data.from.id, `${today}\nPantun kamu pada hari ini adalah\n\n${saa.sampiran}\n${saa.isi}`)
                })
                
              } catch (e) {
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
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin diinput dengan format sebagai berikut.\n\nadd [inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
        })

        this.onText(commands.insert, async (data, after) => {
            const [inisial, grup, role, sites] = after[1].toUpperCase().split(",")
            const leader = true  
            const checkInisial = await this.getInisial(inisial)
            try {
                if (checkInisial === true) {
                    this.sendMessage(data.from.id, `inisial ${inisial} sudah ada pada database kami`)
                } else {
                    await db.query("INSERT INTO dataKaryawan (inisial, grup, role, leader, sites) VALUES ($1, $2,$3,$4, $5)", [inisial, grup, role, leader, sites])
                    this.sendMessage(data.from.id, `inisial ${inisial} berhasil ditambahkan pada database kami`)
                } 
            } catch (error) {
                this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
            }  
        })
    }

    updateDatabase(){
        this.onText(commands.updateDb, data => {
            this.sendMessage(data.from.id, "Silahkan masukan data yang ingin di update dengan format sebagai berikut.\n\n[inisial],[grup],[role],[site]\n\nContoh : \nPBK,A,DCMon,MBCA")
        })
    }

    deleteDatabase(){
        this.onText(commands.deleteDb, async data => {
            this.sendMessage(data.from.id, "Silahkan masukan inisial yang ingin di hapus\nContoh : delete pbk\nFormat: delete <INISIAL>")
        })

        this.onText(commands.delete, async (data, after) => {
            const inisial = after[1].toUpperCase()
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
        let mbcasyso =[];let mbcadcmon = [];let mbcasl = [];let mbcasoc = [];let mbcaizin =[];let mbcasakit =[];let mbcacuti =[];
        let wsasyso =[];let wsadcmon = [];let wsasl = [];let wsasoc = [];let wsaizin =[];let wsasakit =[];let wsacuti =[];
        let gassyso =[];let gasdcmon = [];let gassl = [];let gassoc = [];let gascuti =[];let gasizin =[];let gassakit =[];
        let gacfoc =[];let gacsl = [];let gacsyso = [];let gacdcmon = [];let gacsoc = [];let gacizin =[];let gacsakit =[];let gaccuti =[];
        let grup = dataGenerate[0]
        const resgrup = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND NOT(inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4))", [grup, sakit,izin,cuti])
        const resKeterangan = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND (inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4))", [grup, sakit,izin,cuti])
        const defaultValue = (arr) => {
            if (arr.length === 0) {
                arr.push("-")
            }
        }
        const defaultValueSL = (arr) => {
            if (arr.length === 0) {
                arr.push("- (SL)")
            }
        }
        const sortTL = (arr) => {
            const lead = arr.findIndex(item => item.includes("(TL)"))
            if (lead !== 0 && lead !== -1) {
                const tlValue = arr.splice(lead, 1)[0]
                arr.unshift(tlValue)
            }
            return arr
        }
        try {
            for(let x=0; x<resgrup.rows.length; x++){
                let pushData = resgrup.rows[x].inisial
                switch (resgrup.rows[x].sites) {
                    case 'MBCA':
                        switch (resgrup.rows[x].role) {
                            case 'SYSO':
                                resgrup.rows[x].leader === true ? mbcasyso.push(pushData+ ` (TL)`): mbcasyso.push(pushData)
                                break;
                            case 'DCMON':
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
                            case 'DCMON':
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
                            case 'DCMON':
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
                            case 'DCMON':
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
            for(let y=0; y<resKeterangan.rows.length; y++){
                let pushData = resKeterangan.rows[y].inisial
                switch(resKeterangan.rows[y].sites){
                    case 'MBCA':
                        if(sakit.includes(pushData)){
                            mbcasakit.push(pushData)
                        }
                        if(cuti.includes(pushData)){
                            mbcacuti.push(pushData)
                        }
                        if(izin.includes(pushData)){
                            mbcaizin.push(pushData)
                        }
                        break
                    case 'WSA2':
                        if(sakit.includes(pushData)){
                            wsasakit.push(pushData)
                        }
                        if(cuti.includes(pushData)){
                            wsacuti.push(pushData)
                        }
                        if(izin.includes(pushData)){
                            wsaizin.push(pushData)
                        }
                        break
                    case 'GAS':
                        if(sakit.includes(pushData)){
                            gassakit.push(pushData)
                        }
                        if(cuti.includes(pushData)){
                            gascuti.push(pushData)
                        }
                        if(izin.includes(pushData)){
                            gasizin.push(pushData)
                        }
                        break
                    case 'GAC':
                        if(sakit.includes(pushData)){
                            gacsakit.push(pushData)
                        }
                        if(cuti.includes(pushData)){
                            gaccuti.push(pushData)
                        }
                        if(izin.includes(pushData)){
                            gacizin.push(pushData)
                        }
                        break
                }
            }

            defaultValueSL(mbcasl)
            defaultValueSL(wsasl)
            defaultValueSL(gassl)
            defaultValueSL(gacsl)
            let mbcadcmonSorted = sortTL(mbcadcmon)
            let mbcasysoSorted = sortTL(mbcasyso)
            let gasdcmonSorted = sortTL(gasdcmon)
            let gassysoSorted = sortTL(gassyso)
            let wsadcmonSorted = sortTL(wsadcmon)
            let wsasysoSorted = sortTL(wsasyso)
            defaultValue(mbcasakit)
            defaultValue(mbcacuti)
            defaultValue(mbcaizin)
            defaultValue(wsacuti)
            defaultValue(wsaizin)
            defaultValue(wsasakit)
            defaultValue(gascuti)
            defaultValue(gasizin)
            defaultValue(gassakit)
            defaultValue(gaccuti)
            defaultValue(gacizin)
            defaultValue(gacsakit)

            let data = formatData(mbcasl,mbcasysoSorted,mbcadcmonSorted,mbcasoc,mbcasakit,mbcacuti,mbcaizin,
                wsasl,wsasysoSorted,wsadcmonSorted,wsasoc,wsasakit,wsacuti,wsaizin,
                gassl,gassysoSorted,gasdcmonSorted,gassoc,gassakit,gascuti,gasizin,
                gacsl,gacfoc,gacsakit,gaccuti,gacizin)
            return data
        } catch (error) {
            this.sendMessage(936687738,`${error} pada saat generate getGroup()`)
        }
    }
}

module.exports = SysoBot;