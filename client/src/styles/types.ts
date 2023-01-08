import { Whose } from 'calculator/types';

export type Color =
  | 'white'
  | 'black'
  | 'charcoal'
  | 'taupe'
  | 'caramel'
  | 'beige'
  | 'green'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'disabled';

export interface Font {
  family: string;
  baseSize: string;
  baseWeight: string;
  lineHeight: string;
  color: Color;
  spacing?: string;
}

export interface Theme {
  colors: Record<Color, string>;

  fonts: {
    receipt: Font;
    nameTag: Font;
    boardLetter: Font;
  };

  components: {
    receipt: {
      background: Color;
      width: string;
    };
    invoice: {
      background: Color;
      width: string;
    };
    nameTag: {
      background: Color;
      width: string;
      height: string;
      frameWidth: string;
    };
    whose: Record<Whose, Color>;
    tabBarButton: {
      active: Color;
      inactive: Color;
      text: Color;
    };
  };
}
