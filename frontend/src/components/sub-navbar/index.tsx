import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import PropType from 'prop-types';
import BoardSettings from '@/src/components/sub-navbar/board-settings';
import InviteModal from '@/src/components/sub-navbar/invite-user/modal';
import React, { useEffect } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useAppDispatch } from '@/src/hooks';
import { fetchUsers } from '@/src/slices/users';

import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer';
import { MenuBook as ActivityToggleIcon } from '@mui/icons-material';

interface SubNavbarProps {
  board: any;
  onActivityToggle?: () => void;
  activityOpen?: boolean;
}

const SubNavbar: React.FC<SubNavbarProps> = ({ board, onActivityToggle, activityOpen }) => {
  const users = useAppSelector((state) => state.users.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchMyAPI() {
      await dispatch(fetchUsers());
    }
    fetchMyAPI();
  }, []);

  const loadBoardUsers = () => users.map((user, index) => (
    <Tooltip title={user.fullName} key={index}>
      <Avatar alt={user.fullName} src="https://bit.ly/tioluwani-kolawole" sx={{ mr: 1 }} />
    </Tooltip>
  ));

  return (
    <Box
      sx={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'neutral.main',
        px: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {board?.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{loadBoardUsers()}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <InviteModal />
        <BoardSettings />
        <UnsplashDrawer />
        {onActivityToggle && (
          <Tooltip title={activityOpen ? 'Hide Activity' : 'Show Activity'}>
            <IconButton onClick={onActivityToggle}>
              <ActivityToggleIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

SubNavbar.propTypes = {
  board: PropType.object,
  onActivityToggle: PropType.func,
  activityOpen: PropType.bool
};

export default SubNavbar;
