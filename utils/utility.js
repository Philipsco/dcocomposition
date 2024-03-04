function checkTime() {
    const local_zone = 7
    const _date = new Date()
    let day = _date.getDay()
    const date = ("0" + _date.getDate()).slice(-2);
    const month = ("0" + (_date.getMonth() + 1)).slice(-2);
    const year = _date.getFullYear();
    const hours = _date.getHours() + local_zone;
    const minutes = _date.getMinutes();
    const seconds = _date.getSeconds();

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

module.exports = {checkTime};