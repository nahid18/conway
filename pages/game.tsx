import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useCallback, useEffect } from "react";
import useDimensions from "react-cool-dimensions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";


type Cell = true | false;
type Grid = Cell[][];
type BoardShape = "square" | "rectangle";


export default function GamePage() {
    const neightborOffsets = [
        [-1, -1], // top left
        [-1, 0], // top
        [-1, 1], // top right
        [0, -1], // left
        [0, 1], // right
        [1, -1], // bottom left
        [1, 0], // bottom
        [1, 1], // bottom right
    ];

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
    const [board, setBoard] = useState<Grid>();
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

    const generateRandomBoard = () => {
        const board: Grid = [];
        for (let y = 0; y < rows; y++) {
            board[y] = [];
            for (let x = 0; x < cols; x++) {
                board[y][x] = Math.random() > 0.7 ? true : false;
            }
        }
        return board;
    }

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

    const countTheNeighbors = useCallback((board: Grid, row: number, col: number) => {
        let neighbors = 0;
        neightborOffsets.forEach(([x, y]) => {
            const newCol = col + x;
            const newRow = row + y;
            if (newCol >= 0 && newCol < cols && newRow >= 0 && newRow < rows) {
                neighbors += board[newRow][newCol] ? 1 : 0;
            }
        });
        return neighbors;
    }, [board]);

    const handleNextGeneration = useCallback(() => {
        const newBoard = Array.from(board);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const neighbors = countTheNeighbors(board, i, j);
                if (neighbors < 2 || neighbors > 3) {
                    newBoard[i][j] = false;
                } else if (board[i][j] === false && neighbors === 3) {
                    newBoard[i][j] = true;
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
        setTimeout(runTheGame, 200);
    }, [handleNextGeneration]);

    useEffect(() => {
        handleChildSize();
        setBoard(generateRandomBoard());
    }, [parentWidth, parentHeight, shape, gapSize]);

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
                        <Button variant="subtle" onClick={handleClearClick}>
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
                                row.map((cell, j) =>
                                    {
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
                                    handleClearClick();
                                    setRows(value === 'square' ? SQUARE_ROWS : RECT_ROWS);
                                    setCols(value === 'square' ? SQUARE_COLS : RECT_COLS);
                                    setShape(value as BoardShape);
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
                                    handleClearClick();
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
