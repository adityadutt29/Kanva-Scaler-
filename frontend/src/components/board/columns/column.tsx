import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Edit, Delete, MoreHoriz, DragIndicator } from '@mui/icons-material';
import Cards from '@/components/board/columns/cards';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppDispatch } from '@/hooks';
import { deleteColumn, fetchColumns, updateColumn } from '@/slices/columns';
import { addCard, fetchCards } from '@/slices/cards';
import debounce from 'lodash.debounce';
import { CardDetail } from '@/types/cards';
import { useAppSelector } from '@/hooks';

const Column = ({ showCardDetail, column, index, id, cards }): JSX.Element => {
  const dispatch = useAppDispatch();
  const [showEditBox, setEditBoxVisibility] = useState<boolean>(false);
  const cardRequest = useAppSelector((state) => state.cards.isRequesting);

  const [columnName, setColumnName] = useState<string>(column.columnName);
  const cardsInSortedSequence = cards.sort(
    (cardA: CardDetail, cardB: CardDetail) => cardA.sequence - cardB.sequence
  );

  const loadColumnTitle = (draggableProps) => {
    if (showEditBox) {
      return (
        <TextField
          value={columnName}
          size="small"
          sx={{ width: '60%', ml: '20px' }}
          onChange={handleChange}
          onBlur={() => setEditBoxVisibility(false)}
          onKeyDown={handleKeyDown}
        />
      );
    }

    return (
      <Typography {...draggableProps} component="h6" variant="subtitle2" sx={{ ml: '10px', mt: '5px', textAlign: 'center' }}>
        <Box sx={{ display: 'flex' }}>
          <DragIndicator sx={{ mr: 1, cursor: 'grab' }} /> {columnName}
        </Box>
      </Typography>
    );
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setEditBoxVisibility(false);
      // Save immediately on Enter
      nameChange(columnName);
    }
  };

  const handleCardAdd = async () => {
    await dispatch(addCard(column._id));
    await dispatch(fetchCards());
  };

  const handleChange = (e) => {
    setColumnName(e.target.value);
    handleColumnNameChange(e.target.value);
  };

  const handleColumnDelete = async () => {
    await dispatch(deleteColumn(id));
    await dispatch(fetchColumns());
  };

  const handleColumnNameChange = useCallback(
    debounce((value) => nameChange(value), 800),
    []
  );

  const nameChange = async (value) => {
    const data = {
      columnName: value,
      columnId: column._id
    };

    await dispatch(updateColumn(data));
  };

  return (
    <Draggable draggableId={column._id} index={index} key={column._id}>
      {(provided) => (
        <Box
          key={index}
          sx={{ width: 272, height: 'calc(100vh - 90px)', overflowY: 'auto', mt: '10px', mx: '10px' }}
          {...provided.draggableProps}
          ref={provided.innerRef}>
          <Box
            sx={{
              bgcolor: column.columnName === 'addColumn' ? 'transparent' : 'neutral.main',
              pb: '5px',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}
          >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
              {loadColumnTitle(provided.dragHandleProps)}
              <ColumnMenu
                onEdit={() => setEditBoxVisibility(true)}
                onDelete={handleColumnDelete}
              />
            </Box>
            <Droppable droppableId={column._id} type="card">
              {(provided) => (
                // 2px height is needed to make the drop work when there is no card.
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 2 }}>
                  <Cards showCardDetail={showCardDetail} cards={cardsInSortedSequence} />
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <Button variant="text" sx={{ my: 1, mx: 'auto', width: '90%' }} disabled={cardRequest} onClick={handleCardAdd}>
              + Add a card
            </Button>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

const ColumnMenu = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton aria-label="Options" onClick={handleOpen} size="small">
        <MoreHoriz />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            if (onEdit) onEdit();
          }}
        >
          <Edit sx={{ mr: 1 }} />
          <Typography>Edit</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={async () => {
            handleClose();
            if (onDelete) await onDelete();
          }}
        >
          <Delete sx={{ mr: 1 }} />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Column;
