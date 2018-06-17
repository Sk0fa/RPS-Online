const ws = new WebSocket('ws://localhost:8000');

function message(msg) {
	const li = document.createElement('li');

	li.innerHTML = msg;
	var list = document.getElementById('list');
	list.appendChild(li);
}

ws.onmessage = (msg) => message(msg.data);

form.addEventListener('submit', event => {
	event.preventDefault();
    var loginInput = document.getElementById('login');
    var login = loginInput.value;
    msg = JSON.stringify({
        'type': 'login',
        'login': login
    });
    ws.send(msg);
	loginInput.value = '';
});
