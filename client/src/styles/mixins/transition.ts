export const transition = (property: string, ...rest: string[]): string => `
    transition-property: ${[property, ...rest].join(', ')};
    transition-duration: 0.1s;
    transition-timing-function: ease-in-out;
`;
