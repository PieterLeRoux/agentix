import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar?: {
      main: string;
      text: string;
      selected: string;
    };
    topbar?: {
      main: string;
      text: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      main: string;
      text: string;
      selected: string;
    };
    topbar?: {
      main: string;
      text: string;
    };
  }
}