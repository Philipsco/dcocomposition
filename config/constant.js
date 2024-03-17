const CMD_A = "A";
const CMD_B = "B";
const CMD_C = "C";
const CMD_D = "D";
const failedText = "Gagal memuat data yang diminta, silahkan coba lagi atau hubungi PBK😢"

const dataRandom = [
  "Manteb banget support nya GSIT BCA",
  "Terimakasih untuk supportnya rekan GSIT yang baik hati",
  "Major incident, Sudah mulai berangsur normal",
  "Mau info untuk incident sudah aman dan normal kembali terima kasih ",
  "semoga group POMI ini sepi, hati tenang pikiran damai",
  "Duhai tim gsit makin elegan, Incident kami tutup, terimakasih dan sampai jumpa",
  "Walaupun failure QR masih terjadi, setidaknya sudah semakin membaik",
  "Semoga mulai hari ini, APM QR tidak bedarah kembali",
  "E-Channel sudah normal kembali gan, mantap",
  "terimakasih banyak atas supportnya",
  "terus terang terus team",
  "terimakasih dan selamat melanjutkan aktivitas",
  "terimakasih",
  "terimakasih, kendala selesai dengan tuntas",
  "bodo amat",
  "mohon maaf lahir batin",
  "namanya siapa",
  "jangan sok tau!!",
  "selow aja kali",
  "aku anak mama"
];
const shiftTime = `
Masuk Shift apa ya ka kalau boleh tau??

\/shift_1 : Masuk Shift 1
\/shift_2 : Masuk Shift 2
\/shift_3 : Masuk Shift 3
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
\/masuk_semua - untuk memberi tahu bahwa semua hadir
\/ada_yang_tidak_hadir - untuk memberi tahu bahwa ada yang tidak hadir

Terimakasih
`

const formatData = (mbcasl,mbcasyso,mbcadcmon,mbcasoc,mbcasakit,mbcacuti,mbcaizin,wsasl,wsasyso,wsadcmon,wsasoc,wsasakit,wsacuti,wsaizin,gassl,gassyso,gasdcmon,gassoc,gassakit,gascuti,gasizin,gacsl,gacfoc,gacsakit,gaccuti,gacizin,wsafm,gacsoc)=>{
  let format = `
#MBCA
Hadir : ${mbcasl}, Syso [ ${mbcasyso} ], DCMon [ ${mbcadcmon} ], SOC [ ${mbcasoc} ]
Tidak Hadir : Sakit [ ${mbcasakit} ], Cuti [ ${mbcacuti} ], Izin [ ${mbcaizin} ]
_____________________
#WSA2
Hadir : ${wsasl}, Syso [ ${wsasyso} ], DCMon [ ${wsadcmon} ], SOC [ ${wsasoc} ], FM [ ${wsafm} ]
Tidak Hadir : Sakit [ ${wsasakit} ], Cuti [ ${wsacuti} ], Izin [ ${wsaizin} ]
_____________________
#GAS
Hadir : ${gassl}, Syso [ ${gassyso} ], DCMon [ ${gasdcmon} ], SOC [ ${gassoc} ]
Tidak Hadir : Sakit [ ${gassakit} ], Cuti [ ${gascuti} ], Izin [ ${gasizin} ]
_____________________
#GAC
Hadir : ${gacsl}, SOC [ ${gacsoc} ],FOC [ ${gacfoc} ]
Tidak Hadir : Sakit [ ${gacsakit} ], Cuti [ ${gaccuti} ], Izin [ ${gacizin} ]
_____________________
`
  return format
}

module.exports = {groupBCA, shiftTime, panduanText, greetText, hadirText, failedText, dataRandom,formatData}