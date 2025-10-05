import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from '@/src/hooks';
import { saveBoard } from '@/src/slices/board';

import PropType from 'prop-types';
import React from 'react';
import { Image } from '@mui/icons-material';
import Unsplash from '@/src/components/sub-navbar/unsplash-in-drawer/unsplash';
import { useAppSelector } from '@/src/hooks';

const SubNavbar = (): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const board = useAppSelector((state) => state.board);

  const dispatch = useAppDispatch();

  const btnRef = React.useRef(null);

  const handleSave = async () => {
    await dispatch(saveBoard());
    setIsOpen(false);
  };

  return (
    <>
      <IconButton size="small" sx={{ ml: 0.5, mr: 1 }} ref={btnRef} onClick={() => setIsOpen(true)}>
        <Image />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 360 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <Typography variant="h6">Choose background image</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Unsplash />
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.12)', textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={board.isLoading}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

SubNavbar.propTypes = {
  board: PropType.object
};

export default SubNavbar;
