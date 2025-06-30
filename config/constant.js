const CMD_A = "A"
const CMD_B = "B"
const CMD_C = "C"
const CMD_D = "D"
const SHIFT_1 = '1'
const SHIFT_2 = '2'
const SHIFT_3 = '3'
const failedText = "Gagal memuat data yang diminta, silahkan coba lagi atau hubungi PBK😢"

const dataRandom = [
  "Manteb banget support nya rekan",
  "Terimakasih untuk supportnya rekan yang baik hati",
  "Major incident, Sudah mulai berangsur normal",
  "Mau info untuk incident sudah aman dan normal kembali terimakasih ",
  "semoga group POMI ini sepi dan damai",
  "Duhai tim gsit makin elegan, terimakasih dan sampai jumpa",
  "Walaupun failure QR masih terjadi, setidaknya sudah semakin membaik",
  "Semoga mulai hari ini, APM QR tidak bedarah kembali",
  "E-Channel sudah normal kembali gan",
  "terimakasih banyak atas supportnya",
  "terus terang terus tim",
  "terimakasih dan selamat melanjutkan aktivitas",
  "terimakasih",
  "terimakasih, kendala selesai dengan tuntas",
  "arigato gozaimas kak",
  "terimakasih orang baik",
  "kendala selesai dengan tuntas",
  "sehat sehat terus orang baik",
  "hore, kendala selesai juga"
];
const shiftTime = `
Masuk Shift apa ya ka kalau boleh tau??
`;
const groupBCA = [
  [
    {
      text: "A",
      callback_data: CMD_A
    },
    {
      text: "B",
      callback_data: CMD_B
    }
  ],
  [
    {
      text: "C",
      callback_data: CMD_C
    },
    {
      text: "D",
      callback_data: CMD_D
    }
  ]
]

const choices = [
  [
    {
      text: "Ya, tolong teruskan ke Grup",
      callback_data: "true"
    }
  ],
  [
    {
      text: "Tidak, masih ada yang harus di edit",
      callback_data: "false"
    }
  ]
]

const choiceToDelete =[[
  {
    text: "Ya, tolong HAPUS dari grup",
    callback_data: "deleted"
  }
],
[
  {
    text: "Tidak perlu di hapus ya",
    callback_data: "notDeleted"
  }
]]

const shifting = [
  [
    {
      text: "Shift 1",
      callback_data: SHIFT_1
    },{
      text: "Shift 2",
      callback_data: SHIFT_2
    }
  ],
  [
    {
      text: "Shift 3",
      callback_data: SHIFT_3
    }
  ]
]

const fullTeamOrNot = [
  [
    {
      text: "Masuk Semua",
      callback_data: "fullteam"
    }
  ],
  [
    {
      text: "Ada yang tidak Hadir",
      callback_data: "halfteam"
    }
  ]
]

const panduanText = `
Silahkan gunakan perintah yang tersedia berikut ini :
\/start - Memulai menjalankan bot
\/generate - Generate komposisi Grup Data Center BCA
\/generate_pantun: membantu kamu untuk membuat pantun hari ini
\/gempa - Generate informasi gempa saat ini
\/quote - Generate quote untuk kamu hari ini
\/help - membantu untuk pengecekan command yang digunakan
\/insert_db - input data karyawan
\/update_db - update data karyawan
\/delete_db - delete data karyawan

Terimakasih
`
const greetText= `
Welcome to the SysoBot!
How can I assist you?
Possible use cases:
\/generate - Generate komposisi Grup Data Center BCA
\/gempa - Generate informasi gempa saat ini
\/quote - Generate quote untuk kamu hari ini
\/help - membantu untuk pengecekan command yang digunakan
\/generate_pantun: membantu kamu untuk membuat pantun hari ini
\/insert_db - input data karyawan
\/update_db - update data karyawan
\/delete_db - delete data karyawan

Thankyou
`
const hadirText = `
Apakah member grup masuk semua??
`

const formatData = (mbcasl,mbcasyso,mbcadart,mbcanoc,mbcasakit,mbcacuti,mbcaizin,wsasl,wsasyso,wsadart,wsanoc,wsasakit,wsacuti,wsaizin,gassl,gassyso,gasdart,gasnoc,gassakit,gascuti,gasizin,gacsl,gacfoc,gacsakit,gaccuti,gacizin,wsafm,gacnoc,mbcalpt,mbcatraining,wsalpt,wsatraining,gaslpt,gastraining,gaclpt,gactraining,sumToday,gacsyso,gacdart)=>{
  let format = `
#MBCA
Hadir : ${mbcasl}, Syso [ ${mbcasyso} ], NOC [ ${mbcanoc} ]
Tidak Hadir : Sakit [ ${mbcasakit} ], Cuti [ ${mbcacuti} ], Izin [ ${mbcaizin} ], LPT [ ${mbcalpt} ], Training [ ${mbcatraining} ]
__________________________
#WSA2
Hadir : ${wsasl}, Syso [ ${wsasyso} ], NOC [ ${wsanoc} ], FM [ ${wsafm} ]
Tidak Hadir : Sakit [ ${wsasakit} ], Cuti [ ${wsacuti} ], Izin [ ${wsaizin} ], LPT [ ${wsalpt} ], Training [ ${wsatraining} ]
__________________________
#GAS
Hadir : ${gassl}, Syso [ ${gassyso} ], DART [ ${gasdart} ], NOC [ ${gasnoc} ]
Tidak Hadir : Sakit [ ${gassakit} ], Cuti [ ${gascuti} ], Izin [ ${gasizin} ], LPT [ ${gaslpt} ], Training [ ${gastraining} ]
__________________________
#GAC
Hadir : ${gacsl}, DART [ ${gacdart} ], NOC [ ${gacnoc} ],FOC [ ${gacfoc} ], Syso [ ${gacsyso} ]
Tidak Hadir : Sakit [ ${gacsakit} ], Cuti [ ${gaccuti} ], Izin [ ${gacizin} ], LPT [ ${gaclpt} ], Training [ ${gactraining} ]
__________________________
${sumToday}
`
  return format
}

module.exports = {groupBCA, choices, choiceToDelete, shiftTime, shifting, fullTeamOrNot, panduanText, greetText, hadirText, failedText, dataRandom,formatData}