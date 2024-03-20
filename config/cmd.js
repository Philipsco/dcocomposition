const cmd = {
    start: /\/start/,
    generate:/\/generate$/,
    generatePantun:/\/generate_pantun$/,
    quote: /\/quote/,
    quake: /\/gempa/,
    help:/\/help/,
    sick: /^sakit (.*)/,
    onLeave: /^cuti (.*)/,
    izin: /^izin (.*)/,
    insertDb : /\/insert_db$/,
    updateDb : /\/update_db$/,
    deleteDb :  /\/delete_db$/,
    delete : /^delete (.*)/,
    update  : /^update (.*) with (.*)$/,
    insert : /^add (.*)/,
};

module.exports = cmd;