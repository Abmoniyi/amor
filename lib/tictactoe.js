class TicTacToe {
    constructor(playerX, playerO) {
        this.board = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        this.currentPlayer = 'X';
        this.players = { X: playerX, O: playerO };
        this.isGameOver = false;
    }

    printBoard() {
        return this.board.map(row => row.join(' | ')).join('\n---------\n');
    }

    makeMove(player, row, col) {
        if (this.isGameOver) return "The game is over. Start a new game!";
        if (this.players[this.currentPlayer] !== player) return `It's not your turn!`;
        if (this.board[row][col] !== ' ') return `Cell already taken. Choose another one.`;

        this.board[row][col] = this.currentPlayer;
        if (this.checkWin()) {
            this.isGameOver = true;
            return `${this.printBoard()}\n\nPlayer ${this.currentPlayer} wins! 🎉`;
        }
        if (this.checkDraw()) {
            this.isGameOver = true;
            return `${this.printBoard()}\n\nIt's a draw! 🤝`;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        return `${this.printBoard()}\n\nPlayer ${this.currentPlayer}'s turn.`;
    }

    checkWin() {
        const b = this.board;
        const lines = [
            // Rows
            [b[0][0], b[0][1], b[0][2]],
            [b[1][0], b[1][1], b[1][2]],
            [b[2][0], b[2][1], b[2][2]],
            // Columns
            [b[0][0], b[1][0], b[2][0]],
            [b[0][1], b[1][1], b[2][1]],
            [b[0][2], b[1][2], b[2][2]],
            // Diagonals
            [b[0][0], b[1][1], b[2][2]],
            [b[0][2], b[1][1], b[2][0]]
        ];

        return lines.some(line => line.every(cell => cell === this.currentPlayer));
    }

    checkDraw() {
        return this.board.flat().every(cell => cell !== ' ');
    }
}

module.exports = TicTacToe;
