import type { Theme } from './types';

export const theme: Theme = {
  colors: {
    beige: '#EBE1CA',
    white: '#fff',
    black: '#000',
    charcoal: '#423F3D',
    caramel: '#C6A26E',
    primary: '#9F7A44',
    taupe: '#8A8168',
    green: '#00FF94',
    blue: '#37a6d7',
    red: '#FF0000',
    yellow: '#FFD600',
    disabled: '#E7E7E7',
  },

  fonts: {
    default: {
      family: 'Code New Roman',
      baseSize: '14px',
      lineHeight: '1',
      baseWeight: 'normal',
      color: 'black',
    },
    nameTag: {
      family: 'Nanum Brush Script',
      baseSize: '24px',
      lineHeight: '1',
      baseWeight: 'normal',
      color: 'black',
    },
    boardLetter: {
      family: 'Azeret Mono',
      baseSize: '32px',
      lineHeight: '1',
      baseWeight: '600',
      color: 'black',
    },
    tabBarButton: {
      family: 'Doppio One',
      baseSize: '16px',
      lineHeight: '1',
      baseWeight: '400',
      color: 'white',
    },
  },

  components: {
    receipt: {
      background: 'white',
      width: '350px',
    },
    invoice: {
      background: 'white',
      width: '240px',
    },
    nameTag: {
      background: 'white',
      width: '155px',
      height: '180px',
      frameWidth: '14px',
    },
    whose: {
      mine: 'green',
      theirs: 'red',
      split: 'yellow',
    },
    tabBarButton: {
      active: 'charcoal',
      inactive: 'taupe',
      text: 'white',
    },
  },
};
