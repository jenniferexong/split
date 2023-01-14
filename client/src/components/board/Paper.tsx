import { MouseEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Color } from 'styles/types';

interface PaperProps {
  width: string;
  className?: string;
  height?: string;
  background?: Color;
  children: ReactNode | ReactNode[];
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Container = styled.div<{
  width: string;
  height?: string;
  background?: Color;
}>`
  ${({ theme, width, height, background }) => css`
    width: ${width};

    ${height
      ? css`
          height: ${height};
        `
      : css`
          height: max-content;
        `}

    background: ${background
      ? theme.colors[background]
      : theme.colors[theme.components.receipt.background]};

    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  `}
`;

const Pin = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
`;

const InnerContainer = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Paper = (props: PaperProps) => {
  const { width, height, children, background, className, onClick } = props;

  return (
    <Container
      width={width}
      height={height}
      background={background}
      className={className}
      onClick={onClick}
    >
      <InnerContainer>
        <Pin className="pin" />
        {children}
      </InnerContainer>
    </Container>
  );
};
Paper.displayName = 'Paper';
