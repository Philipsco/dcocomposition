const TelegramBot = require('node-telegram-bot-api');
const commands = require("../config/cmd.js")
const {groupBCA, choices, choiceToDelete, shiftTime, shifting, fullTeamOrNot, panduanText, greetText, hadirText, failedText, dataRandom, formatData} = require("../config/constant.js");
const {checkTime,checkCommands} = require("../utils/utility.js")
const {db} = require('../config/conn.js')
let dataGenerate =[]
let komposisi
class SysoBot extends TelegramBot {
	constructor(token, options) {
		super(token, options)
		checkCommands(this)
		db.connect()
	}

  async checkAndInsertDbUserId(userId, name){
		try {
			const res = await db.query("SELECT * FROM datauserid WHERE userId=$1",[userId])
			if(res.rows[0]=== undefined) {
				await db.query("INSERT INTO datauserid (userid, username) VALUES ($1, $2)", [userId, name])
				return false
			} else {
				return true
			}
		} catch (e) {
			this.sendMessage(userId, failedText)
			this.sendMessage(936687738,`${e} pada saat check dan insert db pada userid`)
		}
  }

	removeItemDataGenerate(id){
		const index = dataGenerate.findIndex(x => x.requestor === id)
		dataGenerate.splice(index,dataGenerate.length)
	}

	getGreeting() {
		this.onText(commands.start, async (data) => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
			this.sendMessage(data.chat.id, greetText)
		})
	}
	
	getQuotes() {
		this.onText(commands.quote, async (data) => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
			const quoteEndpoint = "https://api.kanye.rest/"
			try {
				const apiCall = await fetch(quoteEndpoint)
				const { quote } = await apiCall.json()
				this.sendMessage(data.from.id, `${checkTime()}\nQuotes kamu pada hari ini adalah\n\n${quote}`)
			} catch (e) {
				this.sendMessage(data.from.id, failedText)
				this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}
		})
	}

  getHelp() {
		this.onText(commands.help, async (data) => {
			this.sendMessage(data.from.id, panduanText)
      await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
		})
	}

	async getContainsPattern(){
		let res = await db.query("SELECT regex FROM dataregex")
		let regexObjects = res.rows
		let regexPattern = regexObjects.map(obj => new RegExp(obj.regex))
		return regexPattern
	}

  getEathquake() {
		this.onText(commands.quake, async (data) => {
			const id = data.from.id
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
			const bmkg = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
			const regexs = await this.getContainsPattern()
			try {
				this.sendMessage(id, "mohon ditunggu rekan seperjuangan...")
				const api = await fetch(bmkg)
        const response = await api.json()
        const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = response.Infogempa.gempa
				let wilayahUpperCase = Wilayah.toUpperCase()
				if(!regexs.some(pattern => pattern.test(wilayahUpperCase))){
					const image = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`
        	const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
        	this.sendPhoto(id, image, { caption: result })
				} else {
					this.sendMessage(id, "mohon maaf data tidak ditampilkan dikarenakan masuk dalam regex wilayah kami")
				}
			} catch (e) {
				this.sendMessage(id, failedText)
				this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}
		})
  }
	
	async sendInfoGempaAuto (){
		let dumpGempa = {
			date: null,
			time: null
		}
		const regexs = await this.getContainsPattern()
		const duration = 1 * 90 * 1000
		try {
			setInterval(async () => {
				const bmkg = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json?00"
				const res = await db.query("SELECT userid FROM datauserid")
				const count = res.rowCount
				let data = res.rows
				if (count > 0) {
					const api = await fetch(bmkg)
					const response = await api.json()
					const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = response.Infogempa.gempa
					let wilayahUpperCase = Wilayah.toUpperCase()
					let image = `https://data.bmkg.go.id/DataMKG/TEWS/${Shakemap}`
					for(let x = 0; x < count; x++){
						let userId = data[x].userid
						try {
							if (Magnitude >= 5.0 && (dumpGempa.date !== Tanggal || dumpGempa.time !== Jam)) {
								if(!regexs.some(pattern => pattern.test(wilayahUpperCase))){
									const result = `Dear All,\nBerikut kami informasikan gempa terbaru berdasarkan data BMKG:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`
									setTimeout(async () => {
									await this.sendPhoto(userId, image, { caption: result })
								}	,1*1*50)
								}
							}
						} catch (e) {
							this.sendMessage(userId, "Cycle Check info Gempa Error")
							this.sendMessage(936687738,`${e} pada sendInfoGempaAuto`)
						}
					}
					dumpGempa.date = Tanggal
					dumpGempa.time = Jam
				} else {
					clearInterval(duration)
				}
			}, duration)
		} catch (error) {
			console.error(error)
			if (error.includes('Bad Request: wrong file identifier/HTTP URL specified')){
				console.error("Error Library")
			}
			if(error.includes('Forbidden: bot was blocked by the user')){
				console.error("Blocked by user")
			}
		}
	}
	
	getGenerate() {
		const request = {
			requestor : null,
			group : null,
			shift : null,
			inputSakit : null,
			inputIzin : null,
			inputCuti : null,
			inputLpt : null,
			inputTraining : null
		}
		const paramsKomposisi = {
			requestor : null,
			messageId : null
		}
		this.onText(commands.generate, async (data) => {
				await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
				this.sendMessage(data.from.id, `Halo kamu ingin melakukan generate komposisi grup untuk grup apa ya??`, {
					reply_markup: {
						inline_keyboard: groupBCA
					}
				})
				const check = dataGenerate.some(obj => obj.requestor === data.from.id)
				if (!check) {
					const newReq = {...request, requestor: data.from.id}
					dataGenerate.push(newReq)
				}
		})
		this.on("callback_query", async callback => {
				console.log(callback)
				const index = dataGenerate.findIndex(obj => obj.requestor === callback.from.id)
				if (index !== -1 && dataGenerate[index].group === null){
					dataGenerate[index].group = callback.data
					this.editMessageText(`Kamu memilih Group ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
					this.sendMessage(callback.from.id, shiftTime, {
						reply_markup : {
							inline_keyboard : shifting
						}
					})
				} else if (callback.data === "true") {
					const idSyso = await db.query(`SELECT userid FROM datauserid WHERE username=$1`, ['Syso Community'])
					await this.sendMessage(idSyso.rows[0].userid, await komposisi).then( dataAfter => {
						paramsKomposisi.messageId = dataAfter.message_id
						paramsKomposisi.requestor = dataAfter.chat.id
						this.sendMessage(callback.from.id, "Komposisi yang sebelumnya dikirim mau dihapus ka ?",{
							reply_markup: {
								inline_keyboard : choiceToDelete
							}
						})
					})
					this.editMessageText(`Komposisi sudah di kirim ke Syso Community (${paramsKomposisi.messageId}/${paramsKomposisi.requestor})`, {chat_id : callback.from.id, message_id: callback.message.message_id})
					komposisi = null
				} else if (callback.data === "false") {
					this.editMessageText("Baik, Terimakasih untuk konfirmasi nya", {chat_id : callback.from.id, message_id: callback.message.message_id})
					komposisi = null
				} else if (callback.data === '1') {
					dataGenerate[index].shift = 1
					this.sendMessage(callback.from.id, hadirText, {
						reply_markup : {
							inline_keyboard : fullTeamOrNot
						}
					})
					this.editMessageText(`Kamu memilih Shift ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
				} else if (callback.data === '2') {
					dataGenerate[index].shift = 2
					this.sendMessage(callback.from.id, hadirText, {
						reply_markup : {
							inline_keyboard : fullTeamOrNot
						}
					})
					this.editMessageText(`Kamu memilih Shift ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
				} else if (callback.data === '3') {
					dataGenerate[index].shift = 3
					this.sendMessage(callback.from.id, hadirText, {
						reply_markup : {
							inline_keyboard : fullTeamOrNot
						}
					})
					this.editMessageText(`Kamu memilih Shift ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
				} else if (callback.data === "fullteam") {
					const GROUP = await dataGenerate[index].group
					const SHIFT = await dataGenerate[index].shift
					const DETAIL = await this.getGrup(GROUP,[],[],[],[],[])
					this.sendMessage(callback.from.id, `Dear All\nBerikut #KomposisiGroup${GROUP} Shift ${SHIFT} pada ${checkTime()} :\n${DETAIL}\nBest Regards,\nGroup ${GROUP}`, parse_mode='HTML').then(() => {
					this.sendMessage(callback.from.id, "Mau di teruskan data yang sudah ter generate ke grup Syso Community ?", {
						reply_markup : {
							inline_keyboard : choices
						}
					})
					this.editMessageText(`Kamu memilih ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
				})
				komposisi = `Dear All\nBerikut #KomposisiGroup${GROUP} Shift ${SHIFT} pada ${checkTime()} :\n${DETAIL}\nBest Regards,\nGroup ${GROUP}`
				this.removeItemDataGenerate(callback.from.id)
				} else if (callback.data === "halfteam") {
					this.editMessageText(`Kamu memilih ${callback.data}`, {chat_id : callback.from.id, message_id: callback.message.message_id})
					this.sendMessage(callback.from.id, "Masukkan inisial yang sedang sakit jika tidak ada dapat mencantumkan - \nContoh : sakit pbk,fkh atau sakit -\nFormat : sakit [inisial]")
				} else if (callback.data === "deleted") {
					this.deleteMessage(paramsKomposisi.requestor, paramsKomposisi.messageId)
					this.editMessageText(`Delete Generate Komposisi di Grup BERHASIL`, {chat_id : callback.from.id, message_id: callback.message.message_id})
				} else if (callback.data === "notDeleted") {
					this.editMessageText(`Kamu telah memilih untuk tidak menghapus Generate komposisi pada grup`, {chat_id : callback.from.id, message_id: callback.message.message_id})
					this.sendMessage(callback.from.id, "Jika kamu sudah terlanjur memilih untuk tidak menghapus, maka dapat mintakan PBK untuk menghapus komposisi di Grup Syso Community. Terimakasih")
				} else {
					this.sendMessage(callback.from.id, failedText)
					this.removeItemDataGenerate(callback.from.id)
				}
		})
		this.onText(commands.sick, (data, after) => {
				const index = dataGenerate.findIndex(obj => obj.requestor === data.from.id)
				if (index !== -1) {
					dataGenerate[index].inputSakit = after[1].toUpperCase().split(",")
					this.sendMessage(data.from.id, `data sakit inisial ${dataGenerate[index].inputSakit} berhasil ditambahkan`).then(() => {
						this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang cuti jika tidak ada dapat mencantumkan - \nContoh : cuti pbk,gng atau cuti -\nFormat : cuti [inisial]`)
					})
				} else {
					this.sendMessage(data.from.id, failedText)
				}
		})
		this.onText(commands.izin, async (data, after) => {
			const index = dataGenerate.findIndex(obj => obj.requestor === data.from.id)
			if (index !== -1) {
					dataGenerate[index].inputIzin = after[1].toUpperCase().split(",")
					const IZIN = dataGenerate[index].inputIzin
					this.sendMessage(data.from.id, `data izin inisial ${IZIN} berhasil ditambahkan`).then(() => {
						this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang LPT (Libur Pengganti Training) jika tidak ada dapat mencantumkan - \nContoh : lpt pbk,gng atau lpt -\nFormat : lpt [inisial]`)
					})
			} else {
				this.sendMessage(data.from.id, failedText)
			}	
		})
		this.onText(commands.onLeave, async (data, after) => {
			const index = dataGenerate.findIndex(obj => obj.requestor === data.from.id)
			if (index !== -1) {
				dataGenerate[index].inputCuti = after[1].toUpperCase().split(",")
				this.sendMessage(data.from.id, `data cuti inisial ${dataGenerate[index].inputCuti} berhasil ditambahkan`).then(() => {
					this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang izin jika tidak ada dapat mencantumkan - \nContoh : izin pbk,alj atau izin -\nFormat : izin [inisial]`)
				})
			} else {
				this.sendMessage(data.from.id, failedText)
			}
		})
		this.onText(commands.lpt, (data, after) => {
			const index = dataGenerate.findIndex(obj => obj.requestor === data.from.id)
			if (index !== -1) {
				dataGenerate[index].inputLpt = after[1].toUpperCase().split(",")
				this.sendMessage(data.from.id, `data lpt inisial ${dataGenerate[index].inputLpt} berhasil ditambahkan`).then(() => {
					this.sendMessage(data.from.id, `Silahkan masukkan inisial yang sedang TRAINING jika tidak ada dapat mencantumkan - \nContoh : training pbk,alj atau training -\nFormat : training [inisial]`)
				})
			} else {
				this.sendMessage(data.from.id, failedText)
			}
		})
		this.onText(commands.training, (data, after) => {
			const index = dataGenerate.findIndex(obj => obj.requestor === data.from.id)
			if (index !== -1) {
				dataGenerate[index].inputTraining = after[1].toUpperCase().split(",")
				const GROUP = dataGenerate[index].group
				const SHIFT = dataGenerate[index].shift
				const IZIN = dataGenerate[index].inputIzin
				const CUTI = dataGenerate[index].inputCuti
				const SAKIT = dataGenerate[index].inputSakit
				const LPT = dataGenerate[index].inputLpt
				const TRAINING = dataGenerate[index].inputTraining
				this.sendMessage(data.from.id, `data training inisial ${TRAINING} berhasil ditambahkan`).then(() => {
						this.sendMessage(data.from.id, `Processing Data....`).then(async() => {
							this.sendMessage(data.from.id, `Dear All\nBerikut #KomposisiGroup${GROUP} Shift ${SHIFT} pada ${checkTime()} :\n${await this.getGrup(GROUP,SAKIT,IZIN,CUTI,LPT,TRAINING)}\nBest Regards,\nGroup ${GROUP}`).then(async () => {
								komposisi = `Dear All\nBerikut #KomposisiGroup${GROUP} Shift ${SHIFT} pada ${checkTime()} :\n${await this.getGrup(GROUP,SAKIT,IZIN,CUTI,LPT,TRAINING)}\nBest Regards,\nGroup ${GROUP}`
								this.sendMessage(data.from.id, "Mau di teruskan ke grup Syso Community ?", {
									reply_markup : {
										inline_keyboard : choices
									}
								})
							})
							this.removeItemDataGenerate(data.from.id)
						})
				})
			}
		})
	}
	
	getGeneratePantun(){
		this.onText(commands.generatePantun, async (data) => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
			const pantunEndpoint = "https://rima.rfnaj.id/api/v1/pantun/karmina"
      let x = Math.floor(Math.random() * (dataRandom.length));
      const request = {
				isi: dataRandom[x]
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
					this.sendMessage(data.from.id, `${checkTime()}\nPantun kamu pada hari ini adalah\n\n${saa.sampiran}\n${saa.isi}`)
				})
			} catch (e) {
				this.sendMessage(data.from.id, failedText)
				if (e.includes('Bad Request: wrong file identifier/HTTP URL specified')){
					console.error("Error Library")
				}
				if(e.includes('Forbidden: bot was blocked by the user')){
					console.error("Blocked by user")
				}
        this.sendMessage(936687738,`${e} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}
		})
	}

	async getInisial(inisial){
		let res = await db.query("SELECT * FROM dataKaryawan WHERE inisial= $1", [inisial])
		return res.rows[0] === undefined ? false : true
	}
	
	insertDatabase() {
		this.onText(commands.insertDb, async data => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
			this.sendMessage(data.from.id, "Silahkan masukan data yang ingin diinput dengan format sebagai berikut.\nadd [inisial],[grup],[syso/dcmon],[TL?],[site]\n\nContoh : \nadd PBK,A,DCMon,true,MBCA")
		})
		this.onText(commands.insert, async (data, after) => {
			let [inisial, grup, role, leader, sites] = after[1].toUpperCase().split(",")
			let checkInisial = await this.getInisial(inisial)
			try {
				if (checkInisial === true) {
					this.sendMessage(data.from.id, `inisial ${inisial} sudah ada pada database kami`)
				} else {
					leader === "TRUE" || leader==="TL" || leader==="YES" ? leader = true : leader = false
          await db.query("INSERT INTO dataKaryawan (inisial, grup, role, leader, sites) VALUES ($1, $2,$3,$4, $5)", [inisial, grup, role, leader, sites])
					this.sendMessage(data.from.id, `inisial ${inisial} berhasil ditambahkan pada database kami`)
				} 
			} catch (error) {
				this.sendMessage(936687738,`${error} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}  
		})
  }

	insertDbRegex(){
		this.onText(commands.add, async (data, after) => {
			let regex = after[1].toUpperCase().split(",")
			try {
				await db.query("INSERT INTO dataregex (regex) VALUES ($1)", [regex])
				this.sendMessage(data.from.id, `regex ${regex} berhasil ditambahkan pada database kami`)
			} catch (error) {
				this.sendMessage(936687738,`${error} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}  
		})
	}

  updateDatabase(){
    this.onText(commands.updateDb, async data => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
      this.sendMessage(data.from.id, "Silahkan masukan data yang ingin di update dengan format sebagai berikut.\nupdate[inisial] with [grup],[syso/dcmon],[site]\n\nContoh : \nupdate PBK with A,DCMon,MBCA")
    })
		this.onText(commands.update, async (data, after) => {
			let inisial = after[1].toUpperCase()
			let [grup, role, sites] = after[2].toUpperCase().split(",")
			let checkInisial = await this.getInisial(inisial)
			try {
				if (checkInisial === false) {
					this.sendMessage(data.from.id, `inisial ${inisial} belum ada pada database kami, silahkan tambahkan data dengan menggunakan command \/insert_db`)
				} else {
					await db.query("UPDATE dataKaryawan SET grup=$1, role=$2, sites=$3 WHERE inisial=$4", [grup, role, sites, inisial])
          this.sendMessage(data.from.id, `inisial ${inisial} berhasil diupdate pada database kami`)
				}
			} catch (error) {
				this.sendMessage(936687738,`${error} dengan command ${data.text} pada user ${data.chat.first_name} ${data.chat.last_name} username ${data.chat.username}`)
			}
		})
  }

  deleteDatabase(){
    this.onText(commands.deleteDb, async data => {
			await this.checkAndInsertDbUserId(data.chat.id, data.chat.first_name)
      this.sendMessage(data.from.id, "Silahkan masukan inisial yang ingin di hapus\nContoh : delete pbk\nFormat: delete [inisial]")
    })
    this.onText(commands.delete, async (data, after) => {
			let inisial = after[1].toUpperCase()
      let checkInisial = await this.getInisial(inisial)
      if (checkInisial === true) {
        db.query("DELETE FROM dataKaryawan WHERE inisial=$1",[inisial])
        this.sendMessage(data.from.id,"Berhasil menghapus data")
      } else {
				this.sendMessage(data.from.id,"data tidak ditemukan rekan")
			}
		})
  }

	async getGrup(group,sakit,izin,cuti,lpt,training){
		let mbcasyso =[];let mbcadcmon = [];let mbcasl = [];let mbcasoc = [];let mbcaizin =[];let mbcasakit =[];let mbcacuti =[]; let mbcalpt =[]; let mbcatraining = [];
    let wsasyso =[];let wsadcmon = [];let wsasl = [];let wsasoc = [];let wsaizin =[];let wsasakit =[];let wsacuti =[]; let wsafm = []; let wsalpt =[]; let wsatraining = [];
    let gassyso =[];let gasdcmon = [];let gassl = [];let gassoc = [];let gascuti =[];let gasizin =[];let gassakit =[]; let gaslpt =[]; let gastraining = [];
    let gacfoc =[];let gacsl = [];let gacsyso = [];let gacdcmon = [];let gacsoc = [];let gacizin =[];let gacsakit =[];let gaccuti =[]; let gaclpt =[]; let gactraining = [];
		let sumToday = "Summary : ";
    const resgrup = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND NOT(inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4) OR inisial = ANY($5) OR inisial = ANY($6))", [group,sakit,izin,cuti,lpt,training])
    const resKeterangan = await db.query("SELECT inisial, role, leader, sites FROM dataKaryawan WHERE grup = $1 AND (inisial = ANY($2) OR inisial = ANY($3) OR inisial = ANY($4) OR inisial = ANY($5) OR inisial = ANY($6))", [group,sakit,izin,cuti,lpt,training])
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
		const calculateSum = resgrup.rows.reduce((acc, row) => {
			if (row.leader===true) {
				let leaderRole = `TL-${row.role}`
				acc[leaderRole] = (acc[leaderRole] || 0) + 1
			} else {
				acc[row.role] = (acc[row.role] || 0) + 1
			}
			return acc
		}, {})
		try {
			for(let x=0; x<resgrup.rows.length; x++){
        let pushData = resgrup.rows[x].inisial
        switch (resgrup.rows[x].sites) {
					case 'MBCA':
						switch (resgrup.rows[x].role) {
							case 'SYSO':
								resgrup.rows[x].leader === true ? mbcasyso.push(pushData+ ` (TL)`): mbcasyso.push(pushData)
								break
							case 'DCMON':
								resgrup.rows[x].leader === true ? mbcadcmon.push(pushData+ ` (TL)`): mbcadcmon.push(pushData)
								break
							case 'SL':
								mbcasl.push(pushData+ ` (SL)`)
								break
							case 'SOC':
								mbcasoc.push(pushData)
								break
							default:
								break
							}
							break
          case 'WSA2':
						switch (resgrup.rows[x].role) {
							case 'SYSO':
								resgrup.rows[x].leader === true ? wsasyso.push(pushData+ ` (TL)`): wsasyso.push(pushData)
								break
							case 'DCMON':
								resgrup.rows[x].leader === true ? wsadcmon.push(pushData+ ` (TL)`): wsadcmon.push(pushData)
								break
							case 'SL':
								wsasl.push(pushData+ ` (SL)`)
								break
							case 'SOC':
                wsasoc.push(pushData)
                break
							case 'FM':
								wsafm.push(pushData)
								break
              default:
                break
							}
							break
          case 'GAS':
						switch (resgrup.rows[x].role) {
							case 'SYSO':
								resgrup.rows[x].leader === true ? gassyso.push(pushData+ ` (TL)`): gassyso.push(pushData)
								break
							case 'DCMON':
                resgrup.rows[x].leader === true ? gasdcmon.push(pushData+ ` (TL)`): gasdcmon.push(pushData)
                break
							case 'SL':
								gassl.push(pushData+ ` (SL)`)
								break
							case 'SOC':
								gassoc.push(pushData)
								break
							default:
								break
							}
							break
          case 'GAC':
						switch (resgrup.rows[x].role) {
							case 'SYSO':
                resgrup.rows[x].leader === true ? gacsyso.push(pushData+ ` (TL)`): gacsyso.push(pushData)
                break
							case 'DCMON':
								resgrup.rows[x].leader === true ? gacdcmon.push(pushData+ ` (TL)`): gacdcmon.push(pushData)
								break
							case 'SL':
								gacsl.push(pushData+ ` (SL)`)
								break
							case 'SOC':
								resgrup.rows[x].leader === true ? gacsoc.push(pushData+ ` (TL)`): gacsoc.push(pushData)
								break
							case 'FOC':
								gacfoc.push(pushData)
								break
							case 'PMX / FOC':
								gacfoc.push(pushData+ ` (PMX)`)
								break
							default:
								break
							}
							break
					default:
						break
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
						if(lpt.includes(pushData)){
							mbcalpt.push(pushData)
						}
						if(training.includes(pushData)){
							mbcatraining.push(pushData)
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
						if(lpt.includes(pushData)){
							wsalpt.push(pushData)
						}
						if(training.includes(pushData)){
							wsatraining.push(pushData)
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
						if(lpt.includes(pushData)){
							gaslpt.push(pushData)
						}
						if(training.includes(pushData)){
							gastraining.push(pushData)
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
						if(lpt.includes(pushData)){
							gaclpt.push(pushData)
						}
						if(training.includes(pushData)){
							gactraining.push(pushData)
						}
            break
				}
			}
			for (let role in calculateSum) {
				sumToday += `${role}: ${calculateSum[role]}, `
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
			let gacsysoSorted = sortTL(gacsyso)
			let gacdcmonSorted = sortTL(gacdcmon)
      defaultValue(mbcasakit)
      defaultValue(mbcacuti)
      defaultValue(mbcaizin)
			defaultValue(mbcalpt)
			defaultValue(mbcatraining)
      defaultValue(wsacuti)
      defaultValue(wsaizin)
      defaultValue(wsasakit)
			defaultValue(wsalpt)
			defaultValue(wsatraining)
      defaultValue(gascuti)
      defaultValue(gasizin)
      defaultValue(gassakit)
			defaultValue(gaslpt)
			defaultValue(gastraining)
      defaultValue(gaccuti)
      defaultValue(gacizin)
      defaultValue(gacsakit)
			defaultValue(gaclpt)
			defaultValue(gactraining)
			sumToday = sumToday.slice(0, -2)
			let data = formatData(mbcasl,mbcasysoSorted,mbcadcmonSorted,mbcasoc,mbcasakit,mbcacuti,mbcaizin,
				wsasl,wsasysoSorted,wsadcmonSorted,wsasoc,wsasakit,wsacuti,wsaizin,
        gassl,gassysoSorted,gasdcmonSorted,gassoc,gassakit,gascuti,gasizin,
        gacsl,gacfoc,gacsakit,gaccuti,gacizin,wsafm,gacsoc,mbcalpt,mbcatraining,wsalpt,wsatraining,gaslpt,gastraining,gaclpt,gactraining, sumToday, gacsysoSorted, gacdcmonSorted)
				return data
			} catch (error) {
				this.sendMessage(936687738,`${error} pada saat generate getGroup()`)
			}
	}

	deleteKomposisi(){
		this.onText(commands.del, async (data, after) => {
			let [messageId, userId] = after[1].split("/")
			this.deleteMessage(userId, messageId)
		})
	}
}

module.exports = SysoBot;
