import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Draggable } from 'react-beautiful-dnd';
import { CardDetail } from '@/types/cards';
import { useAppSelector } from '@/hooks';

type Props = {
  showCardDetail: (cardId: string) => void;
  cardIndex: number;
  card: CardDetail;
};

const Card: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const users = useAppSelector((state) => state.users.users);

  const loadAssignedToUser = () => {
    if (!card.assignedTo) return;

    const user = users.filter((user) => user._id === card.assignedTo);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar alt={user[0]?.fullName} sx={{ width: 24, height: 24 }} />
        </Box>
    );
  };

  return (
    // https://github.com/atlassian/react-beautiful-dnd/issues/1767
    <Draggable draggableId={card._id} index={cardIndex} key={card._id}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            m: 1,
            p: 1.5,
            minHeight: '80px',
            bgcolor: 'white',
            cursor: 'pointer',
            borderRadius: 2,
            overflow: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
            },
          }}
          id={card._id}
          onClick={() => showCardDetail(card._id)}
        >
          {card.label && (
            <Chip label={card.label.type} sx={{ bgcolor: card.label.type, color: 'white' }} />
          )}
          <Typography variant="body1">{card.title}</Typography>
          {loadAssignedToUser()}
        </Box>
      )}
    </Draggable>
  );
};

export default Card;
