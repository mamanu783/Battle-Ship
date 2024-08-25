
const Grid = require("./grid");
const Ship = require("./ship")

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


const FLEET_CONFIGURATION = {
    battleship: { name: 'Battleship', length: 4, quantity: 2 },
    submarine: { name: 'Submarine', length: 3, quantity: 1 },
    destroyer: { name: 'Destroyer', length: 2, quantity: 1 },
    patrolBoat: { name: 'Patrol Boat', length: 1, quantity: 3 },
    crusier: { name: 'Crusier', length: 3, quantity: 2 },
};

class Player {
    constructor(name, gridSize = 12) {
        this.name = name;
        this.grid = new Grid(gridSize);
        this.fleet = this.setupFleet();
        this.myshot = [];
        this.fleetDemo = this.setupFleet();
        this.playerReady = false;
    }

    setupFleet() {
        const fleet = [];

        for (const key in FLEET_CONFIGURATION) {
            const { name, length, quantity } = FLEET_CONFIGURATION[key];
            for (let i = 0; i < quantity; i++) {
                fleet.push(new Ship(name, length));
            }
        }

        return fleet;
    }

    checkVaildArrangement(predefinedPositions) {
        for (let i = 0; i < this.fleet.length; i++) {
            const { startX, startY, direction } = predefinedPositions[i];
            const ship = this.fleetDemo[i];


            const isValid = this.grid.TestPlaceShip(ship, startX, startY, direction);
            if (!isValid) {
                this.grid.resetDemo();
                return false;
            }
        }
        return true;
    }

    placeFleet(predefinedPositions) {
        if (this.checkVaildArrangement(predefinedPositions)) {
            for (let i = 0; i < this.fleet.length; i++) {
                const { startX, startY, direction } = predefinedPositions[i];
                const ship = this.fleet[i];
                this.grid.placeShip(ship, startX, startY, direction);
            }
            this.playerReady = true;

            notify("ships has been placed")
        } else {

            report("You have given an invalid arrangement. Hint: Arrangement is side -> to the right for horizontal and down for vertical");
            return;
        }
    }

    // use this to visualise when testing
    //use code to view the state of the play via console
    // visualizeBothGrids(opponentGrid) {
    //     console.log(`${this.name}'s grid:`);
    //     console.log(this.grid.visualizeGrid(true));

    //     console.log(`\n${this.name}'s view of opponent's grid:`);
    //     console.log(opponentGrid.visualizeGrid(false));
    // }
}


module.exports = Player;