const cmd = {
    start: /\/start/,
    generate:/\/generate/,
    quote: /\/quote/,
    help:/\/help/,
    sick: /^sakit$/,
    onLeave: /^cuti$/,
    fullTeam: /\/masuk_semua$/,
    halfTeam: /\/ada_yang_tidak_hadir$/,
    shiftOne : /\/shift_1$/,
    shiftTwo : /\/shift_2$/,
    shiftThree : /\/shift_3$/,
    groupA : /\/group_A$/,
    groupB : /\/group_B$/,
    groupC : /\/group_C$/,
    groupD : /\/group_D$/,
    insertDb : /\/insert_db$/,
    updateDb : /\/update_db$/,
    deleteDb :  /\/delete_db$/
};

module.exports = cmd;