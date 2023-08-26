import styled, { css } from 'styled-components';
import { TabBarButton } from '../button';
import { TabBarMenuButton } from './types';

interface Props {
  position: 'top' | 'bottom';
  buttons: TabBarMenuButton[];
}

const Container = styled.nav<Props>`
  display: flex;
  gap: 52px;
  padding: 0 20px;
  position: sticky;

  ${({ theme }) => css`
    background: ${theme.colors.beige};
  `}
`;

export const TabBarMenu = (props: Props) => {
  const { position, buttons } = props;

  return (
    <Container {...props}>
      {buttons.map(({ label, ...props }) => (
        <TabBarButton key={label} position={position} {...props}>
          {label}
        </TabBarButton>
      ))}
    </Container>
  );
};
TabBarMenu.displayName = 'TabBarMenu';
