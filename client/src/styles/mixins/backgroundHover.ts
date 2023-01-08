import { transition } from './transition';

export const backgroundHover = (): string => `
    ${transition('background')}
    &:hover {
        background: lightGray
    }
`;
