import { TabBarButton } from 'components/button';
import styled, { css } from 'styled-components';

export interface TabBarMenuButton {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface Props {
  position: 'top' | 'bottom';
  buttons: TabBarMenuButton[];
}

const Container = styled.nav<Props>`
  display: flex;
  gap: 52px;
  padding: 0 40px;

  ${props =>
    props.position === 'bottom' &&
    css`
      justify-content: flex-end;
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
