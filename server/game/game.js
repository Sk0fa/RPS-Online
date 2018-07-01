choices = {
    'EMPTY': 0,
    'ROCK': 1,
    'SCISSORS': 2,
    'PAPER': 3
}

class SimpleGame {
    constructor(roundsCount, players) {
        if (!players || players.length != 2) {
            throw "Players must be an array with length = 2";
        }

        this.isFinished = false;
        this.roundsCount = roundsCount;
        this.currentRound = 1;
        this.players = players;
        this.gameScore = new Map();
        this.currentTurn = new Map();
        this.fillCurrentTurn();
        this.fillGameScore();
    }

    fillCurrentTurn() {
        for (var i = 0; i < this.players.length; i++) {
            this.currentTurn.set(this.players[i], choices['EMPTY']);
        }
    }

    fillGameScore() {
        for (var i = 0; i < this.players.length; i++) {
            this.gameScore.set(this.players[i], 0);
        }
    }

    makeTurn(player, choice) {
        this.currentTurn.set(player, choice);
    }

    checkRoundWinner() {
        for (var [key, value] of this.currentTurn) {
            if (value == choices['EMPTY']) {
                return false;
            }
        }

        this.currentRound += 1;
        var winner = this.getRoundWinner();
        this.gameScore.set(winner, this.gameScore.get(winner) + 1);
        this.fillCurrentTurn();

        if (this.currentRound == this.roundsCount) {
            this.isFinished = true;
        }

        return winner;
    }

    getGameWinner() {
        var firstPlayerScore = this.gameScore.get(this.player[0]);
        var secondPlayerScore = this.gameScore.get(this.player[1]);

        return (firstPlayerScore > secondPlayerScore) ?
         this.player[0] : this.player[1];
    }

    getRoundWinner() {
        var fPC = this.currentTurn.get(this.players[0]);
        var sPC = this.currentTurn.get(this.players[1]);

        switch (choices[fPC]) {
            case choices['ROCK']:
                return (choices[sPC] == choices['SCISSORS']) ?
                 this.players[0] : this.players[1];
                break;
            case choices['SCISSORS']:
                return (choices[sPC] == choices['PAPER']) ?
                 this.players[0] : this.players[1];
                 break;
            case choices['PAPER']:
                return (choices[sPC] == choices['ROCK']) ?
                 this.players[0] : this.players[1];
                 break;
            default:
                throw "First player don't choose object";
        }
    }
}

exports.SimpleGame = function (roundsCount, players) {
    return new SimpleGame(roundsCount, players);
};

exports.choices = choices;
