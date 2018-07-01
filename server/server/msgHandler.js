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
        else if (message['type'] == 'turn') {
            this.makeTurnHandler(message, ws);
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
        if (!checkOnLogin(ws) || !checkOnStartGame(msg)) {
            return;
        }

        var player = this.getPlayerFromGame(msg['gameId'], ws);
        this.gameFinder.gameController.makeTurn(msg['gameId'], player, msg['choice']);
        var winner = this.gameFinder.gameController.checkRoundWinner(msg['gameId']);

        var msg = {}
        var game = this.gameFinder.gameController.games[msg['gameId']];
        if (winner) {
            if (game.isFinished) {
                msg = {
                    'type': 'gameFinished',
                    'score': game.gameScore,
                    'winner': winner.login
                }
            }
            else {
                msg = {
                    'type': 'roundEnd',
                    'winner': winner.login
                }
            }

            for (var i = 0; i < game.players.length; i++) {
                game.players[i].ws.send(JSON.stringify(msg));
            }
        }
    }

    getPlayerIndexByWs(ws) {
        return this.wsServer.players.findIndex((el) => {
            return el.ws == ws;
        });
    }

    getPlayerFromGame(gameId, ws) {
        var game = this.gameFinder.gameController.games[gameId];
        for (var i = 0; i < game.players.length; i++) {
            if (ws == game.players[i].ws) {
                return game.players[i];
            }
        }
    }

    getPlayerFromFindersListByWs(ws) {
        return this.gameFinder.findersList.findIndex((el) => {
            return el.ws == ws;
        })
    }

    checkOnLogin(ws) {
        var playerIndex = this.getPlayerIndexByWs(ws);
        if (playerIndex == -1) {
            ws.send(JSON.stringify({
                'type': 'error',
                'error_msg': 'Your connection has no loggined.'
            }));
            return false;
        }
        return true;
    }

    checkOnStartGame(msg) {
        var game = this.gameFinder.gameController.games[msg['gameId']];
        var playerIndex = -1;
        for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].login == msg['login']) {
                playerIndex = i;
                break;
            }
        }

        if (playerIndex == -1) {
            return false;
        }
        return true;
    }
}

exports.MsgHundler = function(wsServer) {
    return new MsgHundler(wsServer);
}
