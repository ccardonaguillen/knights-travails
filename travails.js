class Square {
    constructor(coords, previous = null, next = null) {
        this.coords = coords;
        [this.x, this.y] = coords;
        this.previous = previous;
        this.next = next;
    }

    isEqual(square) {
        return square.x === this.x && square.y === this.y;
    }
}

class KnightsTravails {
    constructor(start, target) {
        this.start = new Square(start);
        this.target = new Square(target);
        this.path = [];
    }

    ALLOWED_MOVES = [
        [2, 1],
        [1, 2],
        [2, -1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [-2, 1],
        [-1, -2],
    ];

    shuffleMoves() {
        // Durstenfeld shuffle (taken from stackoverflow)
        for (let i = 7; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.ALLOWED_MOVES[i], this.ALLOWED_MOVES[j]] = [
                this.ALLOWED_MOVES[j],
                this.ALLOWED_MOVES[i],
            ];
        }
    }

    moveKnight(square) {
        // Randomize allowed moves to get different solutions
        this.shuffleMoves();
        // For each possible move, calculate the square after moving checking if it is in the board
        square.next = this.ALLOWED_MOVES.map(([moveX, moveY]) => {
            const newX = square.x + moveX;
            const newY = square.y + moveY;

            if (newX >= 0 && newX <= 8 && newY >= 0 && newY <= 8) {
                return new Square([newX, newY], square);
            }
        }).filter((val) => val !== undefined);
    }

    shortestPath(square = this.start, queue = []) {
        // Check if we have reached the target square
        if (square.isEqual(this.target)) {
            // Save the path checking predecessors until reaching start square
            this.path.push(square.coords);
            while (square.previous !== null) {
                square = square.previous;
                this.path.unshift(square.coords);
            }
            return;
        }

        // If the square has not been visited, calculate next possible moves
        if (square.next === null) this.moveKnight(square);
        // Append possible moves to queue
        queue.push(...square.next);

        // Visit first queue element recursively until the target has been reached
        return this.shortestPath(queue.shift(), queue);
    }
}

// Example

let game = new KnightsTravails([0, 0], [7, 7]);
game.shortestPath();
console.log(
    `It takes ${game.path.length} moves\n` +
        `to go from ${game.start.coords} to ${game.target.coords}\n` +
        `following this route:\n` +
        game.path.join(' --> ')
);
