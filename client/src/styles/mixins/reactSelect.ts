import { css, FlattenSimpleInterpolation } from 'styled-components';
import { backgroundHover } from './backgroundHover';
import { Theme } from '../types';

export const reactSelect = (theme: Theme): FlattenSimpleInterpolation => css`
  .react-select {
    &__value-container {
      padding: 0;
    }

    &__input-container {
      padding: 0;
      margin: 0;
      display: flex;
      color: ${theme.colors.black};
    }

    &__single-value {
      color: ${theme.colors.black};
    }

    &__input-container::after {
      content: none;
    }

    &__control {
      border: none;
      border-radius: 0;
      min-height: 0;

      ${backgroundHover()}
      &--is-focused {
        box-shadow: 0 0 0 1px ${theme.colors.blue};
      }
    }

    &__input {
      text-transform: uppercase;
      width: 100%;
      grid-area: 1 / -1 / auto / auto;
    }

    &__placeholder {
      color: ${theme.colors.red};
    }
  }
`;
