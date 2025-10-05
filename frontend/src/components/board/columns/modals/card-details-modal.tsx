import React, { FC, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '@/src/hooks';
import { CardDetail } from '@/src/types/cards';
import { deleteCard, fetchCards, updateCard } from '@/src/slices/cards';
import { useAppSelector } from '@/src/hooks';
import { Delete, Close, Laptop, Notes, ArrowDropDown } from '@mui/icons-material';
import CardLabel from '@/src/components/board/columns/modals/card-labels-menu';
import QuillEditor from '@/src/components/quill-editor';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  card: CardDetail;
};

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(card?.title);
  const [description, setDescription] = useState(card?.description);
  const [assigned, assignUser] = useState(card?.assignedTo);

  const cardRequest = useAppSelector((state) => state.cards.isRequesting);
  const cardDelete = useAppSelector((state) => state.cards.isDeleting);
  const users = useAppSelector((state) => state.users.users);

  const handleCardDelete = async () => {
    await dispatch(deleteCard(card._id));
    await dispatch(fetchCards());

    onClose();
  };

  const handleModalClose = async () => {
    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: assigned
    };

    await dispatch(updateCard(data));
    await dispatch(fetchCards());

    onClose();
  };

  const handleClick = async (userId) => {
    assignUser(userId);

    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: userId
    };

    await dispatch(updateCard(data));
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const assignToMenu = () => (
    <>
      <Button size="small" onClick={handleMenuOpen} endIcon={<ArrowDropDown />}>
        Assign To
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {users.map((user, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClick(user._id);
              handleMenuClose();
            }}
          >
            {user?.fullName}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            handleClick('');
            handleMenuClose();
          }}
        >
          Unassign
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <>
      <Dialog fullWidth maxWidth="md" onClose={handleModalClose} open={isOpen}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Laptop sx={{ mr: 1 }} />
          <TextField
            name="title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            variant="outlined"
            fullWidth
          />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <Notes sx={{ mr: 1 }} />
                <Typography>Description</Typography>
              </Box>
              <Box sx={{ ml: 4, mt: 1, minHeight: 200, width: '95%' }}>
                <QuillEditor value={description} onChange={setDescription} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 150 }}>
              <CardLabel id={card._id} boardId={card.boardId} />
              {assignToMenu()}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 24px' }}>
          <Button onClick={handleCardDelete} disabled={cardDelete} variant="contained" color="error" startIcon={<Delete />}>
            Delete
          </Button>
          <Button onClick={handleModalClose} disabled={cardRequest} variant="outlined" startIcon={<Close />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardDetailsModal;
