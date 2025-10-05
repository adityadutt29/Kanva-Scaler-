import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/hooks';
import { AiOutlineHome } from 'react-icons/ai';
import { FaTrello } from 'react-icons/fa';

const UserNavBar: FC = () => {
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <>
          <IconButton onClick={handleMenuOpen} sx={{ mr: 1 }}>
            <Avatar alt={user?.fullName} src="https://bit.ly/tioluwani-kolawole" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { handleMenuClose(); logout(); }}>Log out</MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <>
        <Button component={Link} href="/login" color="primary">Log in</Button>
        <Button component={Link} href="/signup" variant="contained" color="success" sx={{ ml: 1 }}>Sign up</Button>
      </>
    );
  };

  return (
    <Box sx={{ boxShadow: 1, bgcolor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', p: 1 }}>
      <Button component={Link} href="/home" sx={{ ml: 1 }}><AiOutlineHome /></Button>
      <Button component={Link} href="/boards" sx={{ ml: 1, mr: 2 }}>Boards</Button>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Box component="img" src="/kanva-logo.png" alt="Kanva" sx={{ height: 28 }} />
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {renderButtons()}
    </Box>
  );
};

UserNavBar.propTypes = {
  bg: PropTypes.string
};

export default UserNavBar;
