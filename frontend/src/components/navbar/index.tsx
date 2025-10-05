import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/hooks';
type NavBarProps = {
  compact?: boolean;
};

const NavBar: FC<NavBarProps> = ({ compact = false }) => {
  const user = useAppSelector((state) => state.user);

  const logout = async () => {
    const URL = '/api/logout';

    const response = await fetch(URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({})
    });

    const responseInJson = await response.json();

    if (responseInJson.message === 'success') {
      // Clear auth tokens from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = `${window.location.origin}/login`;
    }
  };

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <Button onClick={logout} color="primary">
          Logout
        </Button>
      );
    }

    return (
      <>
        <Button component={Link} href="/login" color="primary">
          Log in
        </Button>
        <Button component={Link} href="/signup" variant="contained" color="primary" sx={{ ml: 2 }}>
          Sign up
        </Button>
      </>
    );
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        bgcolor: 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box
          component="img"
          src="/kanva-logo.png"
          alt="brand logo"
          sx={{
            height: 32,
            m: 1,
            display: compact ? 'none' : 'block',
            '&:hover': { cursor: 'pointer' }
          }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1, ml: compact ? 0 : 1, fontWeight: 600 }}>
          {!compact ? '' : ''}
        </Typography>
        {renderButtons()}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {};

export default NavBar;
