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
		this.connections = {};
		this.currentId = 0;
		this.createEventHandlers();
	}

	createEventHandlers() {
		this.wss.on('connection', ws => {
			var id = this.currentId;
			this.currentId += 1;
			this.connections[id] = ws;
			console.log(`New connection: ${id}`);

			ws.on('message', msg => {
				this.msgHundler.processMsg(msg, ws);
			});

			ws.on('close', () => {
				this.checkForRemovePlayer(ws);
				delete this.connections[id];
				console.log(`Connection with id = ${id} was closed`);
			})
		});
	}

	checkForRemovePlayer(ws) {
		for (const [i, item] of this.players.entries()) {
			if (item.ws == ws) {
				this.players.splice(i, 1);
				console.log(`Player ${item.login} was removed`);
				break;
			}
		}
	}
}

new WsServer();
console.log('Start ws server');
