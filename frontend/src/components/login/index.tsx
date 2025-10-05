import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import checkEnvironment from '@/util/check-environment';
import { useRouter } from 'next/router';
import inviteUser from '@/util/invite-user';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setErrorState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const host = checkEnvironment();
  const router = useRouter();

  const loginUser = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    const data = {
      email: values.email,
      password: values.password
    };

    const url = `${host}/api/login`;

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    const result = await response.json();
    setIsFetching(false);

    const { email: inviteEmail, token, boardId } = router.query;
    const isInvitedUser = inviteEmail && token && boardId;

    if (isInvitedUser && result.message === 'success') {
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userId', result.id);
      }
      
      const hasInvited = await inviteUser({ email: inviteEmail, boardId });

      if (hasInvited) {
        router.push('/home');
      }
    } else if (result.message === 'success') {
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userId', result.id);
      }
      
      router.push('/home');
    }

    if (response.status === 404) {
      setErrorState(true);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const showLoginError = () => {
    if (!hasError) return null;

    return (
      <Alert severity="error" onClose={() => setErrorState(!hasError)} sx={{ mb: 2 }}>
        <AlertTitle>Error</AlertTitle>
        Invalid email or password. Please try again.
      </Alert>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={12}
          sx={{ 
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Logo and Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <Box component="img" src="/kanva-icon.svg" alt="Kanva logo" sx={{ height: 40, mr: 1.5 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 32, color: '#667eea' }}>
                Kanva
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Log in to continue to your workspace
            </Typography>
          </Box>

          {showLoginError()}

          {/* Login Form */}
          <Box component="form" onSubmit={loginUser}>
            <TextField
              type="email"
              name="email"
              value={values.email}
              placeholder="Enter your email"
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail color="#718096" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />

            <TextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={values.password}
              placeholder="Enter your password"
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock color="#718096" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <FiEyeOff color="#718096" /> : <FiEye color="#718096" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isFetching || !values.email || !values.password}
              sx={{
                bgcolor: '#667eea',
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  bgcolor: '#5568d3',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                },
                '&:disabled': {
                  bgcolor: '#cbd5e0',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isFetching ? 'Logging in...' : 'Log In'}
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Don't have an account?{' '}
              <Link href="/signup" passHref>
                <Typography 
                  component="span" 
                  sx={{ 
                    color: '#667eea', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign up for free
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Back to Home */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/" passHref>
            <Typography 
              component="span" 
              sx={{ 
                color: 'white', 
                fontSize: '0.9rem',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ← Back to home
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
