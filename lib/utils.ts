import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Cell = true | false;
export type Grid = Cell[][];

export const neightborOffsets = [
  [0, 1], // right
  [0, -1], // left
  [1, -1], // top left
  [-1, 1], // top right
  [1, 1], // top
  [-1, -1], // bottom
  [1, 0], // bottom right
  [-1, 0], // bottom left
];

export const generateEmptyBoard = (rowNum: number, colNum: number) => {
  const board: Grid = [];
  for (let i = 0; i < rowNum; i++) {
    board.push(Array.from(Array(colNum), () => false));
  }
  return board;
}

export const generateRandomBoard = (rowNum: number, colNum: number) => {
  const board: Grid = [];
  for (let y = 0; y < rowNum; y++) {
    board[y] = [];
    for (let x = 0; x < colNum; x++) {
      board[y][x] = Math.random() > 0.7 ? true : false;
    }
  }
  return board;
}