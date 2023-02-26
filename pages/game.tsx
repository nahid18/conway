import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";


type Cell = true | false;
type Grid = Cell[][];
type BoardShape = "square" | "rectangle";

export default function GamePage() {

    const cellSize = 20;
    const width = 400;
    const height = 400;

    const gapOptions = Array.from(Array(6).keys()).map((i) => i + 2);
    const [gap, setGap] = useState(4);

    const generateRandomBoard = () => {
        const rows = width / cellSize;
        const cols = height / cellSize;
        const board: Grid = [];
        for (let y = 0; y < rows; y++) {
            board[y] = [];
            for (let x = 0; x < cols; x++) {
                board[y][x] = Math.random() < 0.7 ? true : false;
            }
        }
        return board;
    }

    const [board, setBoard] = useState<Grid>(generateRandomBoard());
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const runningRef = useRef(isRunning);

    runningRef.current = isRunning;

    const countTheNeighbors = useCallback((board, row, col) => {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const r = row + i;
                const c = col + j;
                if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) {
                    continue;
                }
                if (board[r][c]) {
                    count++;
                }
            }
        }
        return count;
    }, [board]);

    const handleNextGeneration = useCallback(() => {
        const newBoard = Array.from(board);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const neighbors = countTheNeighbors(board, i, j);
                if (board[i][j]) {
                    if (neighbors < 2 || neighbors > 3) {
                        newBoard[i][j] = false;
                    } else {
                        newBoard[i][j] = true;
                    }
                } else {
                    if (neighbors === 3) {
                        newBoard[i][j] = true;
                    } else {
                        newBoard[i][j] = false;
                    }
                }
            }
        }
        setBoard(newBoard);
        setGeneration((prevGeneration) => prevGeneration + 1);
    }, [board]);

    const handleRunClick = () => {
        setIsRunning(!isRunning);
        runningRef.current = true;
        runTheGame();
    }

    const handleClearClick = () => {
        setIsRunning(false);
        runningRef.current = false;
        setBoard(generateRandomBoard());
        setGeneration(0);
    }

    const runTheGame = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        handleNextGeneration();
        setTimeout(runTheGame, 100);
    }, [handleNextGeneration]);

    return (
        <Layout>
            <section className="container grid items-center gap-4 md:gap-6 pt-4 md:pt-6 pb-8 md:py-10">
                <div className="flex max-w-[980px] flex-col items-start gap-2">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                        Let&apos;s Play
                    </h1>
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-semibold tracking-tight">
                        Generation <span className="text-pink-700 dark:text-pink-500"> {generation}</span>
                    </h4>
                    <div className="flex gap-2">
                        <Button variant="default" onClick={handleRunClick}>
                            {isRunning ? 'Pause' : 'Start'}
                        </Button>
                        <Button variant="subtle" onClick={handleClearClick}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="max-w-[90vw] flex items-center justify-center py-6 md:p-6 bg-pink-900">

                    <div
                        className="board"
                        style={{
                            width: width,
                            height: height,
                            backgroundSize: `${cellSize}px ${cellSize}px`,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: `${gap}px`,
                        }}
                    >
                        {board.map((row, i) =>
                            row.map((cell, j) =>
                                <div
                                    key={`${i}-${j}`}
                                    className="cell"
                                    style={{
                                        width: cellSize - gap,
                                        height: cellSize - gap,
                                        backgroundColor: cell ? '#be185d' : '#fce7f3',
                                    }}
                                >
                                </div>

                            ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div>
                        <Label htmlFor="gap" className="text-lg font-semibold">Gap</Label>
                        <div className="mt-1.5">
                            <Select
                                value={gap.toString()}
                                onValueChange={(value) => {
                                    setGap(parseInt(value));
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Shape" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gapOptions.map((item, idx) => (
                                        <SelectItem
                                            key={idx}
                                            value={item.toString()}
                                        >
                                            {item.toString().charAt(0).toUpperCase() + item.toString().slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}