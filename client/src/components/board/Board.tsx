import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { BoardContext } from './BoardContext';

const Container = styled.div`
  overflow-y: auto;
  width: 100%;

  background: ${props => props.theme.colors.caramel};
  padding: 50px;

  box-shadow: inset 0px 0px 8px 3px rgba(0, 0, 0, 0.25);

  & > *:last-child {
    margin-bottom: 0;
  }
`;

interface BoardProps {
  children: ReactNode | ReactNode[];
}

export const Board = (props: BoardProps) => {
  const { children } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(0);

  const updateBoardWidth = useCallback(() => {
    if (!ref.current) return;

    setBoardWidth(ref.current.getBoundingClientRect().width);
  }, [ref]);

  useLayoutEffect(updateBoardWidth, [updateBoardWidth]);

  useEffect(() => {
    window.addEventListener('resize', updateBoardWidth);

    return () => window.removeEventListener('resize', updateBoardWidth);
  }, [updateBoardWidth]);

  return (
    <Container ref={ref}>
      <BoardContext.Provider value={boardWidth}>
        {children}
      </BoardContext.Provider>
    </Container>
  );
};
Board.displayName = 'Board';
