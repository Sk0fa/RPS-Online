var p = require('../game/player.js');
var gFinder = require('./gameFinder.js');


class MsgHundler {
    constructor(wsServer) {
        this.wsServer = wsServer;
        this.gameFinder = gFinder.GameFinder();
    }

    processMsg(msg, ws) {
        var message = JSON.parse(msg);

        if (message['type'] == 'login') {
            this.loginMsgHandler(message, ws);
        }
        else if (message['type'] == 'findGame') {
            this.findGameHandler(message, ws);
        }
    }

    loginMsgHandler(msg, ws) {
        this.wsServer.players.push(p.Player(msg['login'], ws));
        console.log(`New player created: ${msg['login']}`);
    }

    findGameHandler(msg, ws) {
        var playerIndex = this.wsServer.players.findIndex((el) => {
            return el.ws == ws;
        });
        if (playerIndex == -1) { return; }

        this.gameFinder.addPlayer(this.wsServer.players[playerIndex]);
    }

    makeTurnHandler(msg, ws) {
        var playerIndex = this.wsServer.players.findIndex((el) => {
            return el.ws == ws;
        });
        if (playerIndex == -1) { return; }

        this.gameController.makeTurn(msg['gameId'], player, msg['choice']);
    }
}

exports.MsgHundler = function(wsServer) {
    return new MsgHundler(wsServer);
}
