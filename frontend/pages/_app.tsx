import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@/src/styles/default.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';

import 'nprogress/nprogress.css';

const theme = createTheme({
  palette: {
    primary: { main: '#0079bf' },
    secondary: { main: '#f5f5f5' },
    success: { main: '#70b500' },
    error: { main: '#eb5a46' },
    warning: { main: '#f2d600' },
    info: { main: '#ff9f1a' },
    neutral: { main: '#f5f5f5' }
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Inter',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '0.75rem',
    },
    overline: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '0.75rem',
    }
  }
});

const KanvaApp = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Suppress noisy React StrictMode findDOMNode deprecation warnings originating
    // from third-party libraries (like react-quill) during development.
    if (process.env.NODE_ENV === 'development' && typeof console !== 'undefined') {
      const originalError = console.error;
      // eslint-disable-next-line no-console
      console.error = (...args) => {
        if (args && args[0] && typeof args[0] === 'string') {
          const msg = args[0];
          // Suppress react-quill findDOMNode deprecation in StrictMode
          if (msg.includes('findDOMNode is deprecated')) {
            return;
          }
          // Suppress react-beautiful-dnd warning about defaultProps on memo components
          if (msg.includes('Support for defaultProps will be removed from memo components')) {
            return;
          }
        }
        originalError.apply(console, args);
      };

      return () => {
        // restore
        // eslint-disable-next-line no-console
        console.error = originalError;
      };
    }
    return undefined;
  }, []);

  return (
    <>
      <Head>
        <title>Kanva</title>
        <link rel="shortcut icon" href="/kanva-icon.svg"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NextNprogress color="#0079bf" startPosition={0.3} stopDelayMs={200} height={4} />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

KanvaApp.propTypes = {
  pageProps: PropTypes.object
};

export default KanvaApp;
