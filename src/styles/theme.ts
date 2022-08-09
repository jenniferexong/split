import type { Theme } from './types';

export const theme: Theme = {
  colors: {
    beige: '#EBE1CA',
    white: '#fff',
    black: '#000',
    charcoal: '#423F3D',
    caramel: '#C6A26E',
    green: '#00FF94',
    red: '#FF0000',
    yellow: '#FFD600',
    disabled: '#E7E7E7',
  },

  fonts: {
    receipt: {
      family: 'Consolas',
      baseSize: '14px',
      lineHeight: '1',
      baseWeight: 'normal',
      color: 'black',
    },
    nameTag: {
      family: 'Consolas',
      baseSize: '24px',
      lineHeight: '1',
      baseWeight: 'normal',
      color: 'black',
    },
    boardLetter: {
      family: 'Consolas',
      baseSize: '32px',
      lineHeight: '1',
      baseWeight: '600',
      color: 'black',
    },
  },

  components: {
    receipt: {
      background: 'white',
      width: '350px',
    },
    invoice: {
      background: 'white',
      width: '230px',
    },
    nameTag: {
      background: 'white',
      width: '155px',
      height: '180px',
      frameWidth: '14px',
    },
    buttons: {
      mine: 'green',
      theirs: 'red',
      split: 'yellow',
    },
  },
};
