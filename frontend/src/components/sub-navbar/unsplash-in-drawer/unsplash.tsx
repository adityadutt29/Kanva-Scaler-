import React, { useState, useEffect } from 'react';
import { createApi } from 'unsplash-js';
import { updateBoardDetail } from '@/src/slices/board';
import { useAppDispatch } from '@/src/hooks';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Unsplash = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();
  const unsplash = createApi({ accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (query = 'nature') => {
    setIsLoading(true);
    try {
      const response = await unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 12,
        orientation: 'landscape'
      });

      setImages(response.response?.results || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreImages = async () => {
    setIsLoading(true);
    try {
      const response = await unsplash.search.getPhotos({
        query: searchQuery || 'nature',
        page: currentPage + 1,
        perPage: 12,
        orientation: 'landscape'
      });

      const newImages = response.response?.results || [];
      setImages(prev => [...prev, ...newImages]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = async (imageURL: string) => {
    await dispatch(updateBoardDetail({
      type: 'backgroundImage',
      value: imageURL
    }));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchImages(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Choose Background
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField 
          fullWidth 
          placeholder="Search photos..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          disabled={isLoading}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          sx={{ minWidth: 100 }}
        >
          Search
        </Button>
      </Box>

      {isLoading && images.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={1.5}>
            {images.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={item.id || index}>
                <Box
                  role="button"
                  tabIndex={0}
                  sx={{
                    cursor: 'pointer',
                    backgroundImage: `url('${item.urls.small}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    height: 120,
                    width: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 4
                    },
                    '&:focus': {
                      outline: '2px solid',
                      outlineColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleImageClick(item.urls.regular)}
                  onKeyPress={(e) => e.key === 'Enter' && handleImageClick(item.urls.regular)}
                />
              </Grid>
            ))}
          </Grid>

          {images.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                onClick={loadMoreImages} 
                variant="outlined"
                disabled={isLoading}
                sx={{ minWidth: 140 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  'Load More'
                )}
              </Button>
            </Box>
          )}

          {images.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">
                No images found. Try a different search term.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Unsplash;
