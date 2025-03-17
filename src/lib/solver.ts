export default function solveSudoku(board: string[][]): boolean {
    const solver = new SudokuSolver(board);
    return solver.solve();
}

class SudokuSolver {
    private board: string[][];

    constructor(board: string[][]) {
        this.board = board;
    }

    public solve(): boolean {
        return this.backtrack();
    }

    private backtrack(): boolean {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === ".") {
                    for (let num = 1; num <= 9; num++) {
                        let numStr = num.toString();
                        if (this.isValid(row, col, numStr)) {
                            this.board[row][col] = numStr;
                            if (this.backtrack()) {
                                return true;
                            }
                            this.board[row][col] = ".";
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private isValid(row: number, col: number, num: string): boolean {
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === num || this.board[i][col] === num) {
                return false;
            }
        }

        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[boxRowStart + i][boxColStart + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    public getBoard(): string[][] {
        return this.board;
    }
}
