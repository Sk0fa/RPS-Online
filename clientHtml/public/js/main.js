const ws = new WebSocket('ws://localhost:8000');


function getById(id) {
	return document.getElementById(id);
}

getById('find-game').style.display = "none";

function msgHandler(msg) {
	var message = JSON.parse(msg);
	if (message['type'] == 'error') {
		alert(message['error_msg']);
	}
	else if (message['type'] == 'startGame') {
		startGame();
	}
}

ws.onmessage = (msg) => msgHandler(msg.data);

function startGame() {
	var gameHtml = httpGet('/game.html');
	console.log(gameHtml);
	getById('find-game').style.display = "none";
	getById('game').innerHTML = gameHtml;
}

function findGame() {
	getById('find-game').style.display = "block";
	var msg = JSON.stringify({
		'type': 'findGame'
	});
	ws.send(msg);

	getById('login-form').style.display = "none";
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

form.addEventListener('submit', event => {
	event.preventDefault();
    var loginInput = getById('login');
    var login = loginInput.value;
    var msg = JSON.stringify({
        'type': 'login',
        'login': login
    });
    ws.send(msg);
	loginInput.value = '';

	findGame();
});
