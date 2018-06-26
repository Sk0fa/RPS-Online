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
        var playerIndex = this.getPlayerIndexByWs(ws);
        if (playerIndex != -1) {
            ws.send(JSON.stringify({
                'type': 'error',
                'error_msg': 'Your connection has been loggined.'
            }));
            return;
        }

        this.wsServer.players.push(p.Player(msg['login'], ws));
        console.log(`New player created: ${msg['login']}`);
    }

    findGameHandler(msg, ws) {
        var playerIndex = this.getPlayerFromFindersListByWs(ws);
        if (playerIndex != -1) { return; }
        playerIndex = this.getPlayerIndexByWs(ws);
        if (playerIndex == -1) { return; }

        this.gameFinder.addPlayer(this.wsServer.players[playerIndex]);
    }

    makeTurnHandler(msg, ws) {
        var playerIndex = this.getPlayerIndexByWs(ws);
        if (playerIndex == -1) { return; }

        this.gameController.makeTurn(msg['gameId'], player, msg['choice']);
    }

    getPlayerIndexByWs(ws) {
        return this.wsServer.players.findIndex((el) => {
            return el.ws == ws;
        });
    }

    getPlayerFromFindersListByWs(ws) {
        return this.gameFinder.findersList.findIndex((el) => {
            return el.ws == ws;
        })
    }
}

exports.MsgHundler = function(wsServer) {
    return new MsgHundler(wsServer);
}
