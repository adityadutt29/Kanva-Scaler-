import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { MdSearch, MdRocketLaunch, MdCheckCircle, MdPeople, MdTrendingUp, MdBusiness, MdSchool, MdDesignServices } from 'react-icons/md';
import { useRouter } from 'next/router';

const Templates = (): JSX.Element => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <MdRocketLaunch /> },
    { name: 'Business', icon: <MdBusiness /> },
    { name: 'Marketing', icon: <MdTrendingUp /> },
    { name: 'Design', icon: <MdDesignServices /> },
    { name: 'Education', icon: <MdSchool /> },
    { name: 'Team', icon: <MdPeople /> }
  ];

  const templates = [
    {
      title: 'Kanban Template',
      description: 'Visualize your workflow and improve efficiency with this classic kanban board template.',
      category: 'Business',
      color: '#0079BF',
      features: ['To Do', 'In Progress', 'Done'],
      popular: true
    },
    {
      title: 'Sprint Planning',
      description: 'Plan and track your agile sprints with this comprehensive template for development teams.',
      category: 'Team',
      color: '#61BD4F',
      features: ['Backlog', 'Sprint Tasks', 'Review'],
      popular: true
    },
    {
      title: 'Marketing Campaign',
      description: 'Organize your marketing campaigns from planning to execution and analysis.',
      category: 'Marketing',
      color: '#FF9F1A',
      features: ['Strategy', 'Content', 'Analytics'],
      popular: false
    },
    {
      title: 'Product Roadmap',
      description: 'Plan and communicate your product development roadmap with stakeholders.',
      category: 'Business',
      color: '#EB5A46',
      features: ['Q1', 'Q2', 'Q3', 'Q4'],
      popular: true
    },
    {
      title: 'Design System',
      description: 'Maintain consistency across your design projects with a centralized design system.',
      category: 'Design',
      color: '#C377E0',
      features: ['Components', 'Guidelines', 'Assets'],
      popular: false
    },
    {
      title: 'Content Calendar',
      description: 'Plan, schedule, and track your content creation and publishing workflow.',
      category: 'Marketing',
      color: '#00C2E0',
      features: ['Planning', 'Writing', 'Published'],
      popular: false
    },
    {
      title: 'Team Onboarding',
      description: 'Streamline your employee onboarding process with this structured template.',
      category: 'Team',
      color: '#51E898',
      features: ['Week 1', 'Week 2', 'Resources'],
      popular: false
    },
    {
      title: 'Course Planning',
      description: 'Organize curriculum, lessons, and student assignments for educational purposes.',
      category: 'Education',
      color: '#FF78CB',
      features: ['Syllabus', 'Lessons', 'Assignments'],
      popular: false
    },
    {
      title: 'Bug Tracking',
      description: 'Track and manage software bugs efficiently from report to resolution.',
      category: 'Business',
      color: '#344563',
      features: ['Reported', 'In Progress', 'Resolved'],
      popular: true
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateTitle: string) => {
    router.push('/boards');
  };

  return (
    <Box sx={{ minHeight: '50vh', flexGrow: 3, mx: '2%', p: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Board Templates
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Get started faster with pre-built templates for common workflows
        </Typography>

        <TextField
          fullWidth
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 500, mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch size={24} />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {categories.map((category) => (
            <Chip
              key={category.name}
              label={category.name}
              icon={category.icon}
              onClick={() => setSelectedCategory(category.name)}
              color={selectedCategory === category.name ? 'primary' : 'default'}
              variant={selectedCategory === category.name ? 'filled' : 'outlined'}
              sx={{ 
                fontSize: '0.9rem',
                py: 2.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: selectedCategory === category.name ? 'primary.dark' : 'action.hover'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredTemplates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Box 
                sx={{ 
                  height: 120, 
                  bgcolor: template.color,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {template.popular && (
                  <Chip 
                    label="Popular" 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      bgcolor: 'white',
                      fontWeight: 600
                    }} 
                  />
                )}
                <Typography variant="h5" color="white" fontWeight={700}>
                  {template.title}
                </Typography>
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Chip 
                  label={template.category} 
                  size="small" 
                  sx={{ mb: 2 }}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {template.features.map((feature, idx) => (
                    <Chip 
                      key={idx}
                      label={feature}
                      size="small"
                      icon={<MdCheckCircle />}
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => handleUseTemplate(template.title)}
                  sx={{ 
                    bgcolor: template.color,
                    '&:hover': {
                      bgcolor: template.color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <MdSearch size={64} color="#9CA3AF" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Templates;
