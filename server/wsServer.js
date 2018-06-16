var g = require('./game/game.js');
var p = require('./game/player.js');
var mHundler = require('./server/msgHandler.js');
var WebSocket = require('ws');


class WsServer {
	constructor() {
		this.wss = new WebSocket.Server({ port: 8000 });
		this.msgHundler = new mHundler.MsgHundler(this);
		this.games = [];
		this.players = [];
		this.createEventHandlers();
	}

	createEventHandlers() {
		this.wss.on('connection', ws => {
			ws.on('message', msg => {
				this.msgHundler.processMsg(msg, ws);
			});
		});
	}
}

new WsServer();
console.log('Start ws server');
