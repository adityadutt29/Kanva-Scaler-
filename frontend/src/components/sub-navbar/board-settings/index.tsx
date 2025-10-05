import React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { useAppSelector, useAppDispatch } from '@/src/hooks';
import { updateBoardDetail, saveBoard, fetchBoard, deleteBoard } from '@/src/slices/board';
import { Settings, Delete, Check } from '@mui/icons-material';
import { useRouter } from 'next/router';

const BoardSettings = (): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState('1');
  const board = useAppSelector((state) => state.board.board);
  const boardDetail = useAppSelector((state) => state.board);
  const boardDelete = useAppSelector((state) => state.board.isLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSave = async () => {
  await dispatch(saveBoard());
  await dispatch(fetchBoard(board._id));

  setIsOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteBoard());

    if (boardDetail.status === 'success') {
      router.push('/boards');
    }
  };

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} size="small" sx={{ m: 1 }}>
        <Settings />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Board Settings</DialogTitle>
        <DialogContent>
          <TabContext value={tabValue}>
            <TabList onChange={(e, val) => setTabValue(val)}>
              <Tab label="Basic" value="1" />
              <Tab label="Advance" value="2" />
            </TabList>
            <TabPanel value="1">
              <Box>
                <TextField label="Board name" value={board.name} onChange={(e) => dispatch(updateBoardDetail({ type: 'name', value: e.target.value }))} fullWidth />
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSave} disabled={boardDetail.isLoading}>
                    <Check />
                    &nbsp;Save
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Typography>To delete your board, Click on Delete button.</Typography>
              <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={boardDelete}>
                  <Delete />
                  &nbsp;Delete
                </Button>
              </Box>
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions />
      </Dialog>
    </>
  );
};

export default BoardSettings;
