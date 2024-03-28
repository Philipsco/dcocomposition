const commands = require("../config/cmd.js");

function checkTime() {
    let oregonTime = new Date()
    let oregonOffset = oregonTime.getTimezoneOffset()
    let jakartaOffset = -7 * 60 + oregonOffset + 14 * 60
    let jakartaTime = new Date(oregonTime.getTime() + jakartaOffset * 60 * 1000);
    let day = jakartaTime.getDay()
    const date = ("0" + jakartaTime.getDate()).slice(-2)
    const month = ("0" + (jakartaTime.getMonth() + 1)).slice(-2)
    const year = jakartaTime.getFullYear()
    const hours = jakartaTime.getHours()
    const minutes = jakartaTime.getMinutes()
    const seconds = jakartaTime.getSeconds()

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