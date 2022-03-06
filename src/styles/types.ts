export type Theme = {
  background: string;

  baseFont: {
    font: string;
    size: string;
    color: string;
    lineHeight: string;
  };

  colors: {
    accent: string;
  };

  components: {
    button: {
      background: string;
      textColor: string;
    };
  };
};
