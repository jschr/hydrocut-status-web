import React, { FunctionComponent, useMemo } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Theme: FunctionComponent = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            light: '#93CD56',
            main: '#93CD56',
            // main: '#88B64D',
            dark: '#7AB937',
            // contrastText: '#587730',
            contrastText: '#23420e',
          },
          background: {
            default: prefersDarkMode ? '#303030' : '#FFFFFF',
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
