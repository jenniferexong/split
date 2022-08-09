export type Color =
  | 'white'
  | 'black'
  | 'charcoal'
  | 'caramel'
  | 'beige'
  | 'green'
  | 'red'
  | 'yellow'
  | 'disabled';

export interface Font {
  family: string;
  baseSize: string;
  baseWeight: string;
  lineHeight: string;
  color: Color;
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
    buttons: {
      mine: Color;
      theirs: Color;
      split: Color;
    };
  };
}
