import React, { FunctionComponent } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';

const Theme: FunctionComponent = ({ children }) => {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: blue,
          secondary: {
            light: '#93CD56',
            main: '#93CD56',
            // main: '#88B64D',
            dark: '#7AB937',
            // contrastText: '#587730',
            contrastText: '#23420e',
            // contrastText: '#000',
          },
          background: {
            default: '#fff',
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
