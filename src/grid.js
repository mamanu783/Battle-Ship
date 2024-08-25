
const Ship = require("./ship")

class Grid {
    constructor(size = 12) {
        this.size = size;
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
        this.ships = [];
        this.gridDemo = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }


    resetDemo() {
        this.gridDemo = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }


    placeShip(ship, startX, startY, direction) {
        if (direction === 'V') {
            for (let i = 0; i < ship.length; i++) {
                this.grid[startX][startY + i] = ship;
            }

        } else if (direction === 'H') {
            for (let i = 0; i < ship.length; i++) {
                this.grid[startX + i][startY] = ship;
            }
        }
        this.ships.push(ship);

    }


    TestPlaceShip(ship, startX, startY, direction) {
        if (direction === 'V') {

            // Check if ship fits vertically
            if (startY + ship.length > 11) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.gridDemo[startX][startY + i] !== null) {
                    this.resetDemo();
                    return false;
                }
                this.gridDemo[startX][startY + i] = ship;

            }

        } else if (direction === 'H') {
            // Check if ship fits horizontally
            if (startX + ship.length > 11) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.gridDemo[startX + i][startY] !== null) {
                    this.resetDemo();
                    return false;
                }
                this.gridDemo[startX + i][startY] = ship;
            }

        } else {
            throw new Error("Invalid direction. Use 'V' for vertical or 'H' for horizontal.");
        }
        return true;
    }


    takeShot(x, y) {
        const target = this.grid[x][y];
        if (target instanceof Ship) {
            target.hit();
            this.grid[x][y] = 'H';

            return target.isSunk() ? `Hit and sunk the ${target.name}!` : 'Hit';
        } else {
            this.grid[x][y] = 'M';
            return 'Miss';
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    //use code to view the state of the play via console
    // visualizeGrid(showShips = false) {
    //     let visualization = '  ';
    //     for (let i = 0; i < this.size; i++) {
    //         visualization += `${i} `;
    //     }
    //     visualization += '\n';

    //     for (let i = 0; i < this.size; i++) {
    //         visualization += `${i} `;
    //         for (let j = 0; j < this.size; j++) {
    //             const cell = this.grid[j][i];
    //             if (cell === null) {
    //                 visualization += '. ';  // Empty spot
    //             } else if (cell === 'M') {
    //                 visualization += 'M ';  // Miss
    //             } else if (cell === 'H') {
    //                 visualization += 'H ';  // Hit
    //             } else if (showShips && cell instanceof Ship) {
    //                 visualization += 'S ';  // Ship part (only show for player's own grid)
    //             } else {
    //                 visualization += '. ';  // Unrevealed spot on opponent's grid
    //             }
    //         }
    //         visualization += '\n';
    //     }
    //     return visualization;
    // }
}


module.exports = Grid;