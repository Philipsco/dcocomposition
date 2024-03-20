const commands = require("../config/cmd.js");

function checkTime() {
    const jakarta_zone = 7
    const _date = new Date()
    const usaOffset = _date.getTimezoneOffset()/60
    const timeDiff = jakarta_zone - (-usaOffset)
    const indoTime = new Date(_date.getTime() + timeDiff * 3600000)
    let day = indoTime.getDay()
    const date = ("0" + indoTime.getDate()).slice(-2);
    const month = ("0" + (indoTime.getMonth() + 1)).slice(-2);
    const year = indoTime.getFullYear();
    const hours = indoTime.getHours()
    const minutes = indoTime.getMinutes();
    const seconds = indoTime.getSeconds();

      switch (day) {
        case 0:
          day = "Minggu";
          break;
        case 1:
          day = "Senin";
          break;
        case 2:
           day = "Selasa";
          break;
        case 3:
          day = "Rabu";
          break;
        case 4:
          day = "Kamis";
          break;
        case 5:
          day = "Jumat";
          break;
        case 6:
          day = "Sabtu";
      }

    return day+ ", " + date + "-" + month + "-" + year
}

function checkCommands(bot) {
  bot.on("message", (data) => {
      const isInCommand = Object.values(commands).some((keyword) => keyword.test(data.text))
      if (!isInCommand) {
          bot.sendMessage(data.from.id, "Saya tidak mengerti 🙏\nketik \/\help untuk memunculkan panduan")
      }
  })
}

module.exports = {checkTime,checkCommands};