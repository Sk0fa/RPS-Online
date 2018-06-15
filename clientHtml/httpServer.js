var express = require('express');
var http = require('http');
var fs = require('fs');

const app = express();
const server = http.createServer(app);

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

console.log('Start http server');
