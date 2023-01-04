import { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div`
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

  return <Container>{children}</Container>;
};
Board.displayName = 'Board';
