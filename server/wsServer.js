var g = require('./game/game.js');
var WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

let game = g.Game(21);

wss.on('connection', ws => {
	ws.on('message', msg => {
		if (msg == '!id') {
			ws.send(game.getId());
		}

		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(msg);
			}
		});
	});
});

console.log('Start ws server');
