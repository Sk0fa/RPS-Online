var WebSocket = require('ws');

var server = new WebSocket.Server({ port: 8080 });

server.on('connection', ws => {
	ws.on('message', msg => {
		server.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(msg);
			}
		});
	});
});