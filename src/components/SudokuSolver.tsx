"use client";
import { useState } from "react";
import solveSudoku from "@/lib/solver";

export default function SudokuSolver() {
    const [board, setBoard] = useState<string[][]>(
        Array(9).fill(null).map(() => Array(9).fill(""))
    );

    const handleChange = (row: number, col: number, value: string) => {
        if (!/^[1-9]?$/.test(value)) return; // Allow only digits 1-9 or empty
        setBoard((prev) => {
            const newBoard = prev.map((r) => [...r]);
            newBoard[row][col] = value;
            return newBoard;
        });
    };

    const solve = () => {
        const newBoard = board.map((row) => row.map((cell) => (cell === "" ? "." : cell)));

        if (solveSudoku(newBoard)) {
            setBoard(newBoard);
        } else {
            alert("No solution found!");
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear the board?")) {
            setBoard(Array(9).fill(null).map(() => Array(9).fill("")));
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white border-2 border-slate-100 rounded-lg">
            <div className="grid grid-cols-9 p-2 rounded-lg">
                {board.map((row, i) =>
                    row.map((cell, j) => (
                        <input
                            key={`${i}-${j}`}
                            type="text"
                            value={cell}
                            onChange={(e) => handleChange(i, j, e.target.value)}
                            maxLength={1}
                            className={`
                                w-12 h-12 text-center text-lg font-bold border border-gray-800 bg-white
                                ${i % 3 === 2 && i !== 8 ? "border-b-4 border-gray-800" : ""}
                                ${j % 3 === 2 && j !== 8 ? "border-r-4 border-gray-800" : ""}
                              `}
                        />
                    ))
                )}
            </div>

            <div className="flex gap-2 pb-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={solve}>
                    Solve
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </div>
    );
};
