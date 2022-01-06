import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    logo: {
      dashboard: string;
      login: string;
    };
    colors: {
      // Custom colors
      baseColor: string;
      gradientButton: string;
      header: string;
      headerIcon: string;
      headerLinkActive: string;
      headerLinkInactive: string;
      headerLinkHover: string;
      headerButton: string;

      red: string;
      green: string;
      orange: string;
      black: string;
      belgian: string;
      grayDark: string;
      gray: string;
      grayLight: string;
      whiteDark: string;
      white: string;
    };
    fontSize: {
      extraSmall: string;
      small: string;
      regular: string;
      smallHeader: string;
      header: string;
      key: string;
    };
  }
}
