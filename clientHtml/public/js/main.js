const ws = new WebSocket('ws://localhost:8000');
var selfLogin = '';
var enemyLogin = '';
var selfScore = '0';
var enemyScore = '0';
var gameId = '';

function getById(id) {
	return document.getElementById(id);
}

getById('find-game').style.display = "none";

function msgHandler(msg) {
	var message = JSON.parse(msg);
	type = message['type'];
	if (type == 'error') {
		alert(message['error_msg']);
	}
	else if (type == 'startGame') {
		startGame(message);
	}
	else if (type == 'roundEnd') {
		roundEnd(message);
	}
	else if (type == 'gameFinished') {
		gameFinished(message);
	}
}

ws.onmessage = (msg) => msgHandler(msg.data);

function roundEnd(msg) {
	if (msg['winner'] == selfLogin) {
		selfScore = (parseInt(selfScore) + 1).toString();
	}
	else {
		enemyScore = (parseInt(enemyScore) + 1).toString();
	}
	updateScore();

	getById("turn").style.display = "block";
	getById('enemy-turn-wait').style.display = "none";
}

function gameFinished(msg) {
	var score = msg['score'].join(':');
	getById('game').innerHTML = `Победил ${msg['winner']} со счетом: ${score}`;
}

function startGame(msg) {
	var gameHtml = httpGet('/game.html');
	getById('find-game').style.display = "none";
	getById('game').innerHTML = gameHtml;

	enemyLogin = getEnemyLogin(msg);
	gameId = msg['gameId'];
	getById('self-login').innerHTML = selfLogin;
	getById('enemy-login').innerHTML = enemyLogin;
	getById('enemy-turn-wait').style.display = "none";
}

function getEnemyLogin(msg) {
	console.log(msg);
	if (msg['firstPlayer'] !== selfLogin) {
		return msg['firstPlayer'];
	}

	return msg['secondPlayer'];
}

function findGame() {
	getById('find-game').style.display = "block";
	var msg = JSON.stringify({
		'type': 'findGame'
	});
	ws.send(msg);

	getById('login-form').style.display = "none";
}

function turnMake() {
	getById("turn").style.display = "none";
	getById("enemy-turn-wait").style.display = "block";
	choice = document.querySelector('input[name="choice"]:checked').value;

	msg = JSON.stringify({
		'type': 'turn',
		'gameId': gameId,
		'choice': choice,
		'login': selfLogin
	});

	ws.send(msg);
}

function updateScore() {
	getById("self-score").innerHTML = selfScore;
	getById("enemy-score").innerHTML = enemyScore;
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
	selfLogin = login;

	findGame();
});
