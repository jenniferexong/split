import React, { useContext } from 'react';

export const BoardContext = React.createContext<number>(0);

export const useBoardWidth = (): number => useContext(BoardContext) ?? 0;
