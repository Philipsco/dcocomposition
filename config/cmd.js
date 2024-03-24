const cmd = {
    start: /\/start/,
    generate:/\/generate$/,
    generatePantun:/\/generate_pantun$/,
    quote: /\/quote/,
    quake: /\/gempa/,
    help:/\/help/,
    sick: /^sakit\s*(\S*)/,
    onLeave: /^cuti\s*(\S*)/,
    izin: /^izin\s*(\S*))/,
    insertDb : /\/insert_db$/,
    updateDb : /\/update_db$/,
    deleteDb :  /\/delete_db$/,
    delete : /^delete (.*)/,
    update  : /^update (.*) with (.*)$/,
    insert : /^add (.*)/,
};

module.exports = cmd;