import { createContext, useContext } from 'react';

export const BoardContext = createContext<number>(0);

export const useBoardWidth = (): number => useContext(BoardContext) ?? 0;
