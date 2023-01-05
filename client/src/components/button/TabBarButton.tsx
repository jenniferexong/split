import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'styles/types';
import { ButtonProps } from './types';
import { NavLink } from 'react-router-dom';

interface Props extends ButtonProps {
  to?: string;
  position: 'top' | 'bottom';
}

const getActiveBackground = (
  active: boolean | undefined,
  theme: Theme,
): string =>
  active
    ? theme.colors[theme.components.tabBarButton.active]
    : theme.colors[theme.components.tabBarButton.inactive];

const activeClassName = 'active';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})<Props>`
  text-decoration: none;
  border: none;
  display: flex;
  align-items: center;

  ${({ theme, position }) => css`
    color: ${theme.colors[theme.components.tabBarButton.text]};

    background-color: ${getActiveBackground(false, theme)};
    &.${activeClassName} {
      background-color: ${getActiveBackground(true, theme)};
    }

    &:hover {
      background-color: ${theme.colors[theme.components.tabBarButton.active]};
    }

    ${position === 'top' &&
    css`
      padding: 12px 28px 16px;
      border-radius: 0 0 16px 16px;
    `}

    ${position === 'bottom' &&
    css`
      padding: 16px 28px 12px;
      border-radius: 16px 16px 0 0;
    `}
  `}
`;

const StyledButton = styled.button<Props>`
  text-decoration: none;
  border: none;
  display: flex;
  align-items: center;

  ${({ theme, position }) => css`
    color: ${theme.colors[theme.components.tabBarButton.text]};

    background-color: ${getActiveBackground(false, theme)};

    &:hover {
      background-color: ${theme.colors[theme.components.tabBarButton.active]};
    }

    ${position === 'top' &&
    css`
      padding: 12px 28px 16px;
      border-radius: 0 0 16px 16px;
    `}

    ${position === 'bottom' &&
    css`
      padding: 16px 28px 12px;
      border-radius: 16px 16px 0 0;
    `}
  `}
`;

export const TabBarButton = (props: Props) => {
  const { children, onClick, position, to } = props;

  const handleClick = useCallback(() => {
    onClick?.();
  }, []);

  if (to) {
    return (
      <StyledNavLink
        to={to}
        activeClassName={activeClassName}
        onClick={handleClick}
        position={position}
      >
        {children}
      </StyledNavLink>
    );
  }

  return (
    <StyledButton onClick={handleClick} position={position}>
      {children}
    </StyledButton>
  );
};
TabBarButton.displayName = 'TabBarButton';