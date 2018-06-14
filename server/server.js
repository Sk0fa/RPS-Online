var WebSocket = require('ws');
var express = require('express');
var http = require('http');
var fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
	ws.on('message', msg => {
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(msg);
			}
		});
	});
});


server.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response){
		fs.readFile('./index.html', (err, data) => {
				if (err) {
						console.log(err);
				}
				response.send(data);
		});
});
