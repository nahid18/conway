import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    generateEmptyBoard, 
    generateRandomBoard, 
    Grid, 
    neightborOffsets 
} from "@/lib/utils";

import { useState, useRef, useCallback, useEffect } from "react";
import useDimensions from "react-cool-dimensions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import useInterval from "@/lib/useInterval";


type BoardShape = "square" | "rectangle";

export default function GamePage() {
    const SQUARE_ROWS = 20;
    const SQUARE_COLS = 20;
    const RECT_ROWS = 15;
    const RECT_COLS = 20;
    const GAP_SIZE = 1;
    const GAP_OPTIONS = Array.from({ length: 4 }, (_, i) => i + 1);
    const SHAPE_OPTIONS = ["square", "rectangle"] as BoardShape[];

    const [gapSize, setGapSize] = useState(GAP_SIZE);
    const [rows, setRows] = useState(SQUARE_ROWS);
    const [cols, setCols] = useState(SQUARE_COLS);

    const [shape, setShape] = useState<BoardShape>(SHAPE_OPTIONS[0]);
    const [parentWidth, setParentWidth] = useState(0);
    const [parentHeight, setParentHeight] = useState(0);

    const [childSize, setChildSize] = useState(0);
    const [board, setBoard] = useState<Grid>(generateRandomBoard(SQUARE_ROWS, SQUARE_COLS));
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);

    const runningRef = useRef(isRunning);
    runningRef.current = isRunning;

    const { observe } = useDimensions<HTMLDivElement>({
        onResize: ({ observe, unobserve, width, height }) => {
            setParentWidth(width);
            setParentHeight(height);
            handleChildSize();
            unobserve();
            observe();
        },
    });

    const handleChildSize = () => {
        const childSize = calculateChildSize(parentWidth, parentHeight, gapSize, rows, cols);
        setChildSize(childSize);
    };

    const calculateChildSize = useCallback((
        parentWidth: number,
        parentHeight: number,
        gapSize: number,
        numRows: number,
        numCols: number,
    ) => {
        const pw = Math.floor(parentWidth);
        const ph = Math.floor(parentHeight);
        const childWidth = Math.floor((pw - (numCols - 1) * gapSize) / (numCols));
        const childHeight = Math.floor((ph - (numRows - 1) * gapSize) / (numRows));
        return Math.min(childWidth, childHeight);
    }, [parentWidth, parentHeight, gapSize, rows, cols]);

    const handleRunClick = () => {
        setIsRunning(!isRunning);
        runningRef.current = true;
    }

    const getNewRowsAndCols = (shape: BoardShape) => {
        switch (shape) {
            case "square":
                return {
                    rows: SQUARE_ROWS,
                    cols: SQUARE_COLS,
                };
            case "rectangle":
                return {
                    rows: RECT_ROWS,
                    cols: RECT_COLS,
                };
        }
    }

    const handleRandomize = () => {
        setIsRunning(false);
        runningRef.current = false;
        const { rows, cols } = getNewRowsAndCols(shape);
        setBoard(generateEmptyBoard(rows, cols));
        setGeneration(0)
        setBoard(generateRandomBoard(rows, cols));
        setGeneration(0);
    }

    const handleClear = () => {
        setIsRunning(false);
        runningRef.current = false;
        const { rows, cols } = getNewRowsAndCols(shape);
        setBoard(generateEmptyBoard(rows, cols));
        setGeneration(0);
    }

    const runTheGame = useCallback((grid: Grid) => {
        if (!runningRef.current) {
            return;
        }
        const newBoard = grid.map((row) => [...row]);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let neighbors = 0;
                neightborOffsets.forEach(([x, y]) => {
                    const newI = i+x;
                    const newJ = j+y;
                    if (newI >= 0 && newI < rows && newJ >= 0 && newJ < cols) {
                        neighbors += grid[newI][newJ] ? 1 : 0;
                    }
                });
                if (neighbors < 2 || neighbors > 3) {
                    newBoard[i][j] = false;
                } else if (grid[i][j] === false && neighbors === 3) {
                    newBoard[i][j] = true;
                }
            }
        }
        setBoard(newBoard);
        setGeneration((prevGeneration) => prevGeneration + 1);
    }, [rows, cols]);


    useEffect(() => {
        handleChildSize();
        const { rows, cols } = getNewRowsAndCols(shape);
        setBoard(generateEmptyBoard(rows, cols))
        setBoard(generateRandomBoard(rows, cols));
    }, [parentWidth, parentHeight, shape, rows, gapSize]);

    useEffect(() => {
        setRows(shape === "square" ? SQUARE_ROWS : RECT_ROWS);
        setCols(shape === "square" ? SQUARE_COLS : RECT_COLS);
    }, [shape]);


    useEffect(() => {
        if (generation === 0) {
            return;
        }
    }, [generation]);

    useInterval(() => {
        runTheGame(board);
    }, isRunning ? 100 : null);

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
                        Generation <span className="text-pink-700 dark:text-pink-500">{generation}</span>
                    </h4>
                    <div className="flex gap-2">
                        <Button variant="default" onClick={handleRunClick}>
                            {isRunning ? 'Pause' : 'Start'}
                        </Button>
                        <Button variant="subtle" onClick={handleRandomize}>
                            Randomize
                        </Button>
                        <Button variant="subtle" onClick={handleClear}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div
                    ref={observe}
                    className="h-[50vh] max-w-[90vw] flex items-center justify-center p-2 md:p-6 bg-pink-900"
                >
                    {board && (
                        <div
                            style={{
                                display: 'grid',
                                gridGap: `${gapSize}px`,
                                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                                transition: 'all 0.5s ease',
                            }}
                        >
                            {board.map((row, i) =>
                                row.map((cell, j) => {
                                    return <div
                                        key={`${i}-${j}`}
                                        className="cell cursor-pointer hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
                                        style={{
                                            width: `${childSize}px`,
                                            height: `${childSize}px`,
                                            backgroundColor: cell ? '#be185d' : '#fce7f3',
                                            transition: 'all 0.5s ease',
                                        }}
                                        onClick={() => {
                                            if (!isRunning) {
                                                let newBoard = [...board];
                                                newBoard[i][j] = board[i][j] ? false : true;
                                                setBoard(newBoard);
                                            }
                                        }}
                                    >
                                    </div>;
                                }

                                ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div>
                        <Label htmlFor="shape" className="text-lg font-semibold">Board Shape</Label>
                        <div className="mt-1.5">
                            <Select
                                value={shape}
                                onValueChange={(value) => {
                                    setShape(value as BoardShape);
                                    setBoard(generateRandomBoard(rows, cols));
                                    handleRandomize();
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Shape" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SHAPE_OPTIONS.map((item, idx) => (
                                        <SelectItem
                                            key={idx}
                                            value={item}
                                        >
                                            {item.toString().charAt(0).toUpperCase() + item.toString().slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="gap" className="text-lg font-semibold">Gap</Label>
                        <div className="mt-1.5">
                            <Select
                                value={gapSize.toString()}
                                onValueChange={(value) => {
                                    handleRandomize();
                                    setGapSize(parseInt(value));
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Shape" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GAP_OPTIONS.map((item, idx) => (
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
        </Layout >
    );
}
