import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import UserNavbar from '@/components/user-navbar';
import SubNavbar from '@/components/sub-navbar';
import { useAppSelector, useAppDispatch } from '@/hooks';
import useWebSocket from '@/hooks/useWebSocket';
import { connectWebSocket } from '@/slices/websocket';

import BoardColumns from '@/components/board/columns';
import ActivitySidebar from '@/components/board/activity-sidebar';
import PropType from 'prop-types';
import Cookies from 'js-cookie';

const Board = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);
  const [activitySidebarOpen, setActivitySidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  // Get the authentication token from cookies
  const token = Cookies.get('token');
  
  // Initialize WebSocket connection
  useWebSocket(token);

  // When the board loads, connect to the WebSocket for this board
 useEffect(() => {
    if (board._id) {
      dispatch(connectWebSocket(board._id));
    }
  }, [board._id, dispatch]);

   return (
     <Box sx={{ backgroundImage: `url('${board.backgroundImage}')`, backgroundPosition: 'center', height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
       <UserNavbar />
       <SubNavbar
         board={board}
         onActivityToggle={() => setActivitySidebarOpen(!activitySidebarOpen)}
         activityOpen={activitySidebarOpen}
       />
       <BoardColumns />
       <ActivitySidebar
         open={activitySidebarOpen}
         onClose={() => setActivitySidebarOpen(false)}
       />
     </Box>
   );
};

Board.propTypes = {};

export default Board;
