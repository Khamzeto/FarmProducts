import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#e5fcfb',
  '#d9f2f0',
  '#b8e1df',
  '#94cfcc',
  '#76c0bc',
  '#62b7b3',
  '#55b3ae',
  '#439d99',
  '#358c88',
  '#1d7a76',
];

export const theme = createTheme({
  colors: {
    myColor,
  },
});
