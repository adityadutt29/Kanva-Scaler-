import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchBoards } from '@/slices/boards';
import { MdDashboard, MdPeople, MdTrendingUp, MdAccessTime } from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import Link from 'next/link';

const Home = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.boards.boards);
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const recentBoards = boards.slice(0, 3);
  const totalBoards = boards.length;

  const stats = [
    {
      icon: <MdDashboard size={32} />,
      label: 'Total Boards',
      value: totalBoards,
      color: '#0079BF'
    },
    {
      icon: <MdAccessTime size={32} />,
      label: 'Recent Activity',
      value: recentBoards.length,
      color: '#5BA4CF'
    },
    {
      icon: <MdTrendingUp size={32} />,
      label: 'Active Projects',
      value: totalBoards,
      color: '#61BD4F'
    }
  ];

  return (
    <Box sx={{ minHeight: '50vh', flexGrow: 3, mx: '2%', p: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#0079BF', fontSize: 24 }}>
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Welcome back, {user.fullName || 'User'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your projects today
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={700} color="text.primary">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            Recent Boards
          </Typography>
          <Button 
            variant="text" 
            onClick={() => router.push('/boards')}
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
        </Box>

        {recentBoards.length > 0 ? (
          <Grid container spacing={2}>
            {recentBoards.map((board, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Link
                  href={{
                    pathname: '/boards/[slug]',
                    query: { slug: board._id }
                  }}
                  legacyBehavior
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: 140,
                      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${board.backgroundImage})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        color="white" 
                        textAlign="center"
                        sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
                      >
                        {board.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F4F5F7' }}>
            <MdDashboard size={64} color="#9CA3AF" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              No boards yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first board to get started with organizing your projects
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AiOutlinePlus />}
              onClick={() => router.push('/boards')}
            >
              Create Board
            </Button>
          </Card>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#F4F5F7', transform: 'translateY(-2px)' }
              }}
              onClick={() => router.push('/boards')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <MdDashboard size={40} color="#0079BF" />
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  View All Boards
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#F4F5F7', transform: 'translateY(-2px)' }
              }}
              onClick={() => router.push('/templates')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <MdDashboard size={40} color="#61BD4F" />
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  Browse Templates
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#F4F5F7', transform: 'translateY(-2px)' }
              }}
              onClick={() => router.push('/settings')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <MdPeople size={40} color="#FF9F1A" />
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  Settings
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#F4F5F7', transform: 'translateY(-2px)' }
              }}
              onClick={() => router.push('/boards')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <AiOutlinePlus size={40} color="#5BA4CF" />
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                  Create Board
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
