const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;


const { ethers } = require("ethers");



function str2hex(payload) {
    return ethers.hexlify(ethers.toUtf8Bytes(payload));
}

async function report(payload) {
    let data = payload;
    if (payload === null || payload === undefined) {
        data = "null"
    }
    const report_req = await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: str2hex(data) }),
    });
    return;
}


async function notify(payload) {
    let data = payload;
    if (payload === null || payload === undefined) {
        data = "null"
    }
    const notice_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: str2hex(data) }),
    });

    return;
}


const BattleshipGame = require("./BSgame")


class Lobby {
    constructor() {
        this.games = [];
    }

    createGame(playerId) {

        const game = new BattleshipGame(playerId);
        this.games.push(game);

        notify(`${playerId} created a game. Waiting for another player...`);


        return game;
    }

    joinGame(player2Id) {
        const availableGame = this.games.find(game => game.player2 == null);
        if (availableGame) {
            availableGame.addPlayer2(player2Id);
            notify(`${player2Id} joined the game!`);

            return availableGame;

        } else {
            report("No available games. Please create a new game or wait for an existing one.");
        }
    }


    listGames() {
        report("Available games:");
        this.games.forEach((game, index) => {
            report(`${index + 1}: ${game.player1.name} vs ${game.player2 ? game.player2.name : "Waiting for player"}`);
        });
    }

}

module.exports = Lobby;
