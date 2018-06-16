var p = require('../game/player.js');


class MsgHundler {
    constructor(wsServer) {
        this.wsServer = wsServer;
    }

    processMsg(msg, ws) {
        var message = JSON.parse(msg);

        if (message['type'] == 'login') {
            this.loginMsgHandler(message, ws);
        }
    }

    loginMsgHandler(msg, ws) {
        this.wsServer.players.push(p.Player(msg['login'], ws));
        console.log(this.wsServer.players);
    }
}

exports.MsgHundler = function(wsServer) {
    return new MsgHundler(wsServer);
}
