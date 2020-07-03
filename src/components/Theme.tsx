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
