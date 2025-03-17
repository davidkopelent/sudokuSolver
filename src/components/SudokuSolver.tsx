"use client";
import { useState, useRef } from "react";
import solveSudoku from "@/lib/solver";
import { createWorker, PSM } from 'tesseract.js';
import Loader from "./Loader";

export default function SudokuSolver() {
    const [board, setBoard] = useState<string[][]>(
        Array(9).fill(null).map(() => Array(9).fill(""))
    );
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle image selection
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImage(url);

        // Wait for image to load before processing
        await new Promise((resolve) => setTimeout(resolve, 500));
        processImage(url);
    };

    // Process the image and extract numbers
    const processImage = async (imageSrc: string) => {
        setIsProcessing(true);
        try {
            const imageElement = new Image();
            imageElement.src = imageSrc;
            await new Promise((resolve) => (imageElement.onload = resolve));

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Resize the image for better processing
            canvas.width = 450;
            canvas.height = 450;
            ctx.drawImage(imageElement, 0, 0, 450, 450);

            const cellSize = 50;
            const newSudoku = Array(9).fill(null).map(() => Array(9).fill(""));

            // Create a Tesseract worker - more efficient than creating a new one for each cell
            const worker = await createWorker('eng');

            // Set optimal parameters for digit recognition
            await worker.setParameters({
                tessedit_char_whitelist: '123456789',
                tessedit_pageseg_mode: PSM.SINGLE_CHAR,
                preserve_interword_spaces: '0',
            });

            // Process each cell
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const x = col * cellSize;
                    const y = row * cellSize;

                    // Extract cell image data
                    const cellImageData = ctx.getImageData(x, y, cellSize, cellSize);

                    // Create a canvas for this cell and apply preprocessing
                    const cellCanvas = document.createElement("canvas");
                    cellCanvas.width = cellSize;
                    cellCanvas.height = cellSize;
                    const cellCtx = cellCanvas.getContext("2d");
                    if (!cellCtx) continue;

                    // Draw the cell
                    cellCtx.putImageData(cellImageData, 0, 0);

                    // Convert to base64
                    const cellBase64 = cellCanvas.toDataURL();

                    try {
                        // Use the worker to recognize the digit
                        const { data } = await worker.recognize(cellBase64);
                        const digit = data.text.trim();

                        if (digit.match(/^[1-9]$/)) {
                            newSudoku[row][col] = digit;
                        }
                    } catch (error) {
                        console.error(`OCR failed for cell [${row},${col}]:`, error);
                    }
                }
            }

            // Terminate the worker when done
            await worker.terminate();

            console.log("Parsed Sudoku Board: ", newSudoku);
            setBoard(newSudoku);
        } catch (error) {
            console.error("Error processing image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

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
            setImage(null);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white border-2 border-slate-100 rounded-xl relative">
            {/* Image upload section */}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-black border-2 border-slate-100 rounded-lg"
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : "Upload sudoku from image"}
            </button>

            {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="z-10">
                        <Loader />
                    </div>
                </div>
            )}

            {image && <img src={image} alt="Uploaded Sudoku" className="w-72 border" />}

            {/* Sudoku board */}
            <div className="grid grid-cols-9 p-2 rounded-lg">
                {board.map((row, i) =>
                    row.map((cell, j) => (
                        <input
                            key={`${i}-${j}`}
                            type="text"
                            value={cell}
                            onChange={(e) => handleChange(i, j, e.target.value)}
                            maxLength={1}
                            disabled={isProcessing}
                            className={`
                                w-8 h-8 text-center text-lg font-bold border border-gray-800 bg-white
                                ${i % 3 === 2 && i !== 8 ? "border-b-4 border-gray-800" : ""}
                                ${j % 3 === 2 && j !== 8 ? "border-r-4 border-gray-800" : ""}
                                sm:w-12 sm:h-12
                            `}
                            aria-label={`Cell at row ${i + 1} column ${j + 1}`}
                            tabIndex={0}
                        />
                    ))
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pb-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={solve}>
                    Solve
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </div>
    );
}
