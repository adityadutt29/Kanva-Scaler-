import React from 'react';
import NavBar from '@/components/navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useRouter } from 'next/router';
import { FiCheckCircle, FiUsers, FiZap, FiTrello } from 'react-icons/fi';

const WelcomeScreen = (): JSX.Element => {
  const router = useRouter();

  const features = [
    {
      icon: <FiTrello size={40} />,
      title: 'Visual Boards',
      description: 'Organize tasks with intuitive Kanban boards that make project management a breeze.'
    },
    {
      icon: <FiUsers size={40} />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates and team-wide visibility.'
    },
    {
      icon: <FiZap size={40} />,
      title: 'Boost Productivity',
      description: 'Streamline workflows and get more done with powerful automation features.'
    },
    {
      icon: <FiCheckCircle size={40} />,
      title: 'Track Progress',
      description: 'Monitor project status at a glance and keep everyone aligned on goals.'
    }
  ];

  return (
    <>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <NavBar />
        
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4} sx={{ py: { xs: 6, md: 10 } }}>
            <Grid xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Kanva helps teams move work forward.
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Collaborate, manage projects, and reach new productivity peaks. From high rises to the
                home office, the way your team works is unique—accomplish it all with Kanva.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => router.push('/signup')}
                  sx={{ 
                    bgcolor: 'white',
                    color: '#667eea',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => router.push('/login')}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid xs={12} md={6}>
              <Box 
                component="img" 
                src="/homepage/home-illustration.svg" 
                alt="Kanva illustration" 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: { xs: 300, md: 500 },
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' }
                  }
                }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f7fafc', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>
              Everything you need to succeed
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', maxWidth: '600px', mx: 'auto' }}>
              Powerful features designed to help teams collaborate better and achieve more
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: '#667eea', mb: 2, display: 'flex', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#2d3748' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
              Ready to get started?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
              Join thousands of teams already using Kanva to streamline their work
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/signup')}
              sx={{ 
                bgcolor: 'white',
                color: '#667eea',
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start for Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#2d3748', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            © 2025 Kanva. Built by <a href="https://github.com/adityadutt29" style={{ color: '#667eea', textDecoration: 'none' }}>Aditya Dutt</a>
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default WelcomeScreen;
