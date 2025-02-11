import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#000000',
      600: '#000000',
      700: '#000000',
      800: '#000000',
      900: '#000000',
      950: '#000000',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#000000',
          inverseColor: '#ffffff',
          hoverColor: '#1a1a1a',
          activeColor: '#333333',
        },
        highlight: {
          background: '#000000',
          focusBackground: '#1a1a1a',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '#000000',
          inverseColor: '#ffffff',
          hoverColor: '#1a1a1a',
          activeColor: '#333333',
        },
        highlight: {
          background: '#000000',
          focusBackground: '#1a1a1a',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },
});

export default customPreset;
