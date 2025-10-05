import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks';
import { useAppSelector } from '@/hooks';
import { updateBoardDetail, resetBoard } from '@/slices/board';
import { createBoard, fetchBoards } from '@/slices/boards';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdSearch, MdDashboard, MdStar, MdAccessTime } from 'react-icons/md';
import shortId from 'shortid';

const Boards = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const boards = useAppSelector((state) => state.boards.boards);

  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.board);
  const boardRequest = useAppSelector((state) => state.boards.isRequesting);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleCreate = async () => {
    const id = shortId.generate();
    const date = new Date().toLocaleString();

    dispatch(updateBoardDetail({ type: '_id', value: id }));
    dispatch(updateBoardDetail({ type: 'dateCreated', value: date }));

    await dispatch(createBoard());
    await dispatch(fetchBoards());
    await dispatch(resetBoard());

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = {
      type: 'name',
      value: e.target.value
    };

    dispatch(updateBoardDetail(data));
  };

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const createBoardModal = () => {
    return (
      <Dialog onClose={onClose} open={isOpen} fullWidth maxWidth="sm">
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField 
              value={board.name} 
              onChange={handleChange} 
              placeholder="Enter board name..." 
              fullWidth 
              autoFocus
              helperText="Give your board a descriptive name"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={boardRequest || !board.name.trim()} 
            variant="contained"
          >
            {boardRequest ? 'Creating...' : 'Create Board'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ flexGrow: 3, mx: '2%', p: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Your Boards
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage and organize all your projects in one place
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
          <TextField
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch size={20} />
                </InputAdornment>
              )
            }}
          />
          <Button 
            onClick={onOpen} 
            startIcon={<AiOutlinePlus />} 
            variant="contained" 
            color="success"
            sx={{ minWidth: 160 }}
          >
            Create Board
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<MdDashboard />}
            label="All Boards"
            onClick={() => setFilterType('all')}
            color={filterType === 'all' ? 'primary' : 'default'}
            variant={filterType === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<MdStar />}
            label="Starred"
            onClick={() => setFilterType('starred')}
            color={filterType === 'starred' ? 'primary' : 'default'}
            variant={filterType === 'starred' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<MdAccessTime />}
            label="Recent"
            onClick={() => setFilterType('recent')}
            color={filterType === 'recent' ? 'primary' : 'default'}
            variant={filterType === 'recent' ? 'filled' : 'outlined'}
          />
        </Box>
      </Box>

      {filteredBoards.length > 0 ? (
        <Grid container spacing={2}>
          {filteredBoards.map((board, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link
                href={{
                  pathname: '/boards/[slug]',
                  query: { slug: board._id }
                }}
                legacyBehavior
              >
                <a style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: 140,
                      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${board.backgroundImage})`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography 
                      sx={{ 
                        textAlign: 'center', 
                        textTransform: 'capitalize', 
                        color: 'white', 
                        fontSize: 18, 
                        fontWeight: 700,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                        px: 2
                      }}
                    >
                      {board.name}
                    </Typography>
                  </Card>
                </a>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F4F5F7' }}>
          <MdDashboard size={80} color="#9CA3AF" />
          <Typography variant="h5" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            {searchQuery ? 'No boards found' : 'No boards yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery 
              ? 'Try adjusting your search query'
              : 'Create your first board to start organizing your work'
            }
          </Typography>
          {!searchQuery && (
            <Button 
              variant="contained" 
              startIcon={<AiOutlinePlus />}
              onClick={onOpen}
              size="large"
            >
              Create Your First Board
            </Button>
          )}
        </Card>
      )}

      {createBoardModal()}
    </Box>
  );
};

export default Boards;
