import styled, { css, useTheme } from 'styled-components';
import { fontMixin } from 'styles/mixins';
import { Paper } from './Paper';

interface PersonProps {
  name: string;
  image?: string;
}

const Name = styled.section`
  ${({ theme }) => css`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    > * {
      ${fontMixin(theme.fonts.nameTag)}
      height: min-content
    }
  `}
`;

const InnerContainer = styled.div`
  ${({
    theme: {
      components: {
        nameTag: { frameWidth },
      },
    },
  }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    padding: ${frameWidth} ${frameWidth} 0;
  `}
`;

const Image = styled.img`
  ${({
    theme: {
      components: { nameTag },
    },
  }) => css`
    border-image: none;
    width: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);
    height: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);
    min-height: calc(${nameTag.width} - ${nameTag.frameWidth} * 2);

    background: lightGray;
  `}
`;

export const Person = (props: PersonProps) => {
  const { name, image } = props;

  const {
    components: { nameTag },
  } = useTheme();

  return (
    <Paper width={nameTag.width} height={nameTag.height}>
      <InnerContainer>
        <Image src={image}></Image>
        <Name>
          <h2>{name}</h2>
        </Name>
      </InnerContainer>
    </Paper>
  );
};
