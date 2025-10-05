import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from 'next/link';
import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import shortId from 'shortid';
import checkEnvironment from '@/util/check-environment';
import { useRouter } from 'next/router';

const SignUp = (): JSX.Element => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [isCreating, setIsCreatingStatus] = useState(false);
  const [hasError, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Failed to create account. Please check your details and try again.');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
  const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const validate = () => {
    if (!validEmail.test(values.email)) {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }

    if (!validPassword.test(values.password)) {
      setPasswordErr(true);
    } else {
      setPasswordErr(false);
    }
    
    if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const showToast = () => {
    alert('Account created successfully! Redirecting to login...');
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsCreatingStatus(true);
    setErrorState(false);

    const id = shortId.generate();
    const host = checkEnvironment();

    const { email, password, confirmPassword, fullName } = values;

    const data = {
      id,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      fullName: fullName
    };

    const url = `${host}/api/register`;

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
    setIsCreatingStatus(false);
    setResponseStatus(response.status);

    if (response.status !== 200) {
      setErrorState(true);
      if (response.status === 409) {
        setErrorMessage('Email is already registered');
      } else {
        setErrorMessage('Failed to create account. Please check your details and try again.');
      }
    }

    const { email: inviteEmail, token, boardId } = router.query;
    const isInvitedUser = inviteEmail && token && boardId;

    if (isInvitedUser && result.message === 'success') {
      redirectToLoginPage(`/login?token=${token}&email=${inviteEmail}&boardId=${boardId}`);
    } else {
      if (result.message === 'success') {
        redirectToLoginPage();
      }
    }
  };

  const redirectToLoginPage = (path = '/login') => {
    showToast();

    setTimeout(() => {
      window.location.href = path;
    }, 2000);
  };

  const showSignUpError = () => {
    if (!hasError) return null;
    return <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });

    validate();
  };

  const isButtonDisabled = () => {
    const passwordsDontMatch = values.password !== values.confirmPassword;
    const isDisabled = !values.email || !values.fullName;

    return passwordsDontMatch || isDisabled || !values.password || !values.confirmPassword;
  };

  const getPasswordStrength = () => {
    const password = values.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();

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
              Create your account
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Start organizing your work in minutes
            </Typography>
          </Box>

          {showSignUpError()}

          {/* Sign Up Form */}
          <Box component="form" onSubmit={registerUser}>
            <TextField
              type="text"
              name="fullName"
              value={values.fullName}
              placeholder="Full name"
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser color="#718096" />
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
              type="email"
              name="email"
              value={values.email}
              placeholder="Email address"
              onChange={handleChange}
              fullWidth
              required
              error={emailErr && values.email.length > 0}
              helperText={emailErr && values.email.length > 0 ? "Please enter a valid email address" : ""}
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
              placeholder="Create password"
              onChange={handleChange}
              fullWidth
              required
              error={passwordErr && values.password.length > 0}
              helperText={passwordErr && values.password.length > 0 ? "Password must be at least 6 characters with letters and numbers" : ""}
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
                mb: 1,
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

            {values.password && (
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#718096' }}>
                    Password strength
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: passwordStrength < 50 ? '#e53e3e' : passwordStrength < 75 ? '#dd6b20' : '#38a169',
                    fontWeight: 600
                  }}>
                    {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: passwordStrength < 50 ? '#e53e3e' : passwordStrength < 75 ? '#dd6b20' : '#38a169',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            )}

            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={values.confirmPassword}
              placeholder="Confirm password"
              onChange={handleChange}
              fullWidth
              required
              error={passwordMismatch && values.confirmPassword.length > 0}
              helperText={passwordMismatch && values.confirmPassword.length > 0 ? "Passwords do not match" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock color="#718096" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <FiEyeOff color="#718096" /> : <FiEye color="#718096" />}
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
              disabled={isButtonDisabled() || isCreating}
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
              {isCreating ? 'Creating account...' : 'Create Account'}
            </Button>
          </Box>

          {/* Login Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Already have an account?{' '}
              <Link href="/login" passHref>
                <Typography 
                  component="span" 
                  sx={{ 
                    color: '#667eea', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Log in
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

export default SignUp;
