'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      rhino: string;
      blueBayoux: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      rhino?: string;
      blueBayoux?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7500',
    },
    common: {
      white: "#FFFFFF",
    },
    custom: {
      rhino: "#2F4362",
      blueBayoux: "#4F6D7A",
    },
  },
  typography: {
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontFamily: `var(--font-montserrat)`,
  }
});

export default theme;