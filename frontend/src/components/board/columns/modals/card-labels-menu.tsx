import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { MdLabelOutline } from 'react-icons/md';
import { updateCard } from '@/src/slices/cards';
import { useAppDispatch } from '@/src/hooks';
import { Label } from '@/src/types/cards';

type Props = {
  id: string;
  boardId: string;
  cardLabels?: Label[];
};

const defaultLabels: Label[] = [
  { type: 'green', bg: '#2ecc71' } as Label,
  { type: 'yellow', bg: '#f1c40f' } as Label,
  { type: 'red', bg: '#e74c3c' } as Label,
  { type: 'blue', bg: '#3498db' } as Label
];

const CardLabel: FC<Props> = ({ id, boardId, cardLabels = defaultLabels }) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClick = async (label: Label) => {
    const data = {
      _id: id,
      boardId,
      label
    };

    await dispatch(updateCard(data));
    handleClose();
  };

  return (
    <Box sx={{ mt: '2rem', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography component="samp" sx={{ whiteSpace: 'nowrap' }}>
        ADD TO CARD
      </Typography>
      <List sx={{ p: '5px' }}>
        <ListItem>
          <Button onClick={handleOpen} startIcon={<MdLabelOutline />}>
            Labels
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {cardLabels.map((item, index) => (
              <MenuItem key={index} onClick={() => handleClick(item)} sx={{ bgcolor: item.bg, mb: 1 }}>
                <Box sx={{ minHeight: 20 }} />
              </MenuItem>
            ))}
          </Menu>
        </ListItem>
      </List>
    </Box>
  );
};

export default CardLabel;
