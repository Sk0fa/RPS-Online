class Player {
    constructor(login, ws) {
        this.login = login;
        this.ws = ws;
    }
}

exports.Player = function(login, ws) {
    return new Player(login, ws);
}
