import { useCallback } from 'react';
import styled, { css, SimpleInterpolation } from 'styled-components';
import { Theme } from 'styles/types';
import { BaseButtonProps } from './types';
import { NavLink } from 'react-router-dom';
import { fontMixin, transition } from 'styles/mixins';

interface TabBarButtonProps extends BaseButtonProps {
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

const tabBarButton = (
  theme: Theme,
  position: 'top' | 'bottom',
): SimpleInterpolation => css`
  ${fontMixin(theme.fonts.tabBarButton)}

  text-decoration: none;
  border: none;
  display: flex;
  align-items: center;

  // TODO create shared mixin
  color: ${theme.colors[theme.components.tabBarButton.text]};

  background-color: ${getActiveBackground(false, theme)};

  ${transition('background-color')}
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
`;

const StyledNavLink = styled(NavLink).attrs({
  activeclassname: activeClassName,
})<TabBarButtonProps>`
  ${({ theme, position }) => css`
    ${tabBarButton(theme, position)}

    &.${activeClassName} {
      background-color: ${getActiveBackground(true, theme)};
    }
  `}
`;

const StyledButton = styled.button<TabBarButtonProps>`
  ${({ theme, position }) => css`
    ${tabBarButton(theme, position)}
  `}
`;

export const TabBarButton = (props: TabBarButtonProps) => {
  const { children, onClick, position, to } = props;

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  if (to) {
    return (
      <StyledNavLink
        to={to}
        activeclassname={activeClassName}
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
