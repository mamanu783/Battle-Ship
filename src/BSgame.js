
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


const Player = require("./player");



class BattleShipGame {
    constructor(player1Id, gridSize = 11) {
        this.player1 = new Player(player1Id, gridSize);
        this.player2 = null;
        this.gridSize = gridSize;
        this.gameStarted = false;
        this.news = null;
        this.gameEnded = false;
        this.player1turn = true;
        this.player2turn = false;
    }
    addPlayer2(player2Id) {
        this.player2 = new Player(player2Id, this.gridSize);

    }
    getPlayerReady(sender) {
        if (sender === this.player1.name) {
            return this.player1.playerReady;
        }

        return this.player2.playerReady;
    }

    getPlayer1id() {
        return this.player1.name;
    }

    getPlayer2id() {
        return this.player2.name;
    }

    setPlayerFleet(player, positions) {
        player.placeFleet(positions);

    }



    getNews() {

        notify(this.news)
    }

    getFleet(sender) {
        if (sender == this.player1.name) {
            notify(JSON.stringify(this.player1.grid.ships));

            return

        }

        notify(JSON.stringify(this.player2.grid.ships))

    }
    getGrid(sender) {
        if (sender == this.player1.name) {
            notify(JSON.stringify(this.player1.grid.grid));

            return
        }
        notify(JSON.stringify(this.player2.grid.grid))

    }

    getMyShots(sender) {
        if (sender == this.player1.name) {
            notify(JSON.stringify(this.player1.myshot));

            return
        }
        notify(JSON.stringify(this.player2.myshot))

    }

    getOpponentShot(sender) {
        if (sender == this.player1.name) {
            notify(JSON.stringify(this.player2.myshot));

            return
        }
        notify(JSON.stringify(this.player1.myshot))

    }

    gamePlay(x, y, state) {
        if (state == 0) {
            // this.player1.visualizeBothGrids(this.player2.grid);
            this.gameStarted = true;
            const result = this.player2.grid.takeShot(x, y);
            this.player1.myshot.push({ "x": x, "y": y, "result": result, });
            this.news = `${this.player1.name} shoots at (${x}, ${y}): ${result}`

            notify(`${this.player1.name} shoots at (${x}, ${y}): ${result}`);

            if (this.player2.grid.allShipsSunk()) {
                notify(`${this.player1.name} wins!`);
                this.news = (`${this.player1.name} wins!`);
                notify(this.news)
                this.gameEnded = true;
                return true;
            } else {

                notify("the game continues")
                return false;
            }
        } else if (state == 1) {
            // this.player2.visualizeBothGrids(this.player1.grid);
            this.gameStarted = true;
            const result = this.player1.grid.takeShot(x, y);
            this.player2.myshot.push({ "x": x, "y": y, "result": result, });
            this.news = `${this.player2.name} shoots at (${x}, ${y}): ${result}`

            notify(`${this.player2.name} shoots at (${x}, ${y}): ${result}`);

            if (this.player1.grid.allShipsSunk()) {
                notify(`${this.player2.name} wins!`);
                this.news = (`${this.player2.name} wins!`);
                notify(this.news)
                this.gameEnded = true;
                return true;
            } else {

                notify("the game continues")
                return false;
            }
        }

    }

    playTurn(x, y, player) {

        // with the given fleet example, use fleet for both players, enter [0,1] as x , y for testing
        let test = [[1, 1], [2, 1], [3, 1], [4, 10], [5, 10], [6, 10], [7, 10], [8, 1], [8, 2], [8, 3], [2, 7], [3, 7], [4, 7], [8, 8], [8, 9], [0, 6], [4, 4], [10, 0], [6, 8], [6, 7], [6, 6]]


        test.forEach(element => {
            let [m, n] = element;
            this.gamePlay(m, n, 0)
            this.gamePlay(m, n, 1)

        });

        if (this.player1turn && this.player1.name == player) {
            this.gamePlay(x, y, 0)
            this.player1turn = false;
            this.player2turn = true;
        } else if (this.player2turn && this.player2.name == player) {
            this.gamePlay(x, y, 1)
            this.player1turn = true;
            this.player2turn = false;

        } else {

            report("it is not your turn... wait ....")
        }


    }
}


module.exports = BattleShipGame;
