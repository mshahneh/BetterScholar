import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getDesignTokens } from './themes/theme';
import { IconButton } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import MainPage from './Pages/MainPage';


const address = "http://localhost:3006";

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState('light');
  const [authors, setAuthors] = React.useState({});
  const [loadingAuthors, setLoadingAuthors] = React.useState(true);


  React.useEffect(() => {
    if (localStorage.getItem('mode') !== null)
      setMode(localStorage.getItem('mode'));
    else
      setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  React.useEffect(() => {
    setLoadingAuthors(true);
    fetch(address + '/api/users').then(res => res.json()).then(data => {
      setAuthors(data);
      setLoadingAuthors(false);
      if (localStorage.getItem('authorsOrder') === null) {
        localStorage.setItem('authorsOrder', JSON.stringify(data.map((item) => item.id)))
      }

    }).catch(err => {
      console.log(err);
    })
  }, [])



  const onAuthorSubmit = (user) => {
    fetch(address + '/api/adduser/' + user).then(res => res.json()).then(data => {
      setAuthors(data);
    }).catch(err => { console.log(err); })
  }

  React.useEffect(() => {
    localStorage.setItem('mode', mode)
  }, [mode]);


  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
        // localStorage.setItem('mode', mode)
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const ColorModeContext = React.createContext({
    toggleColorMode: () => {
      // This is intentional
    }
  });




  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainPage authors={authors} loadingAuthors={loadingAuthors} onAuthorSubmit={onAuthorSubmit} />
        <IconButton style={{ position: "absolute", top: 10, right: 10 }} onClick={colorMode.toggleColorMode} aria-label="delete">
          {mode === 'light' ? <BedtimeIcon /> : <LightModeIcon />}
        </IconButton>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}