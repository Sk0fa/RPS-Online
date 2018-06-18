var timers = require('timers');
var g = require('../game/game.js');
var gController = require('./gameController.js');


class GameFinder {
    constructor() {
        this.findersList = [];
        this.gameController = gController.GameController();
        timers.setInterval(this.checkFindersList, 2000, this);
    }

    addPlayer(player) {
        this.findersList.push(player);
    }

    checkFindersList(self) {
        var i = 0;
        while (i < self.findersList.length - 1) {
            self.createNewGame(self.findersList[i], self.findersList[i + 1]);
            self.findersList.splice(i, 2);
        }
    }

    createNewGame(firstPlayer, secondPlayer) {
        var newGame = g.SimpleGame(3, [firstPlayer, secondPlayer]);
        this.gameController.addNewGame(newGame);
    }
}


exports.GameFinder = () => {
    return new GameFinder();
}
