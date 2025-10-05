import React, { useState, FC, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddColumnButton from '@/components/board/columns/buttons/add-column-button';
import CardDetailsModal from '@/components/board/columns/modals/card-details-modal';
import Column from '@/components/board/columns/column';
import { CardDetail } from '@/types/cards';
import { useAppSelector, useAppDispatch } from '@/hooks';
import {
  addColumnToBoard,
  fetchColumns,
  updateColumnSequenceToLocalState,
 updateColumnSequence
} from '@/slices/columns';
import {
  updateCardSequence,
  updateCardSequenceToLocalState,
  updateSearchFilters,
 applySearchFilters,
  fetchCards
} from '@/slices/cards';
import SearchFilters from '@/components/board/search-filters';

import shortId from 'shortid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const BoardColumns: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const columns = useAppSelector((state) => state.columns.columns);
  const cards = useAppSelector((state) => state.cards.cards);
  const filteredCards = useAppSelector((state) => state.cards.filteredCards);
  const searchFilters = useAppSelector((state) => state.cards.searchFilters);

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [cardDetail, setCardDetail] = useState<CardDetail>({ _id: '', title: '', description: '' });

  const showCardDetail = (cardId: string) => {
    // Use filtered cards if search filters are applied, otherwise use all cards
    const allCards = searchFilters.searchText || searchFilters.labels.length > 0 || searchFilters.assignees.length > 0
      ? filteredCards
      : cards;
    const card = allCards.filter((card) => card._id === cardId);

    setCardDetail(card[0]);
    onOpen();
  };

  const addColumn = async () => {
    const columnId = shortId.generate();

    await dispatch(addColumnToBoard(columnId));
    await dispatch(fetchColumns());
  };

  const filterCards = (columnId: string) => {
    // Use filtered cards if search filters are applied, otherwise use all cards
    const allCards = searchFilters.searchText || searchFilters.labels.length > 0 || searchFilters.assignees.length > 0
      ? filteredCards
      : cards;
    const filteredCardsResult = allCards.filter((card) => card.columnId === columnId);

    return filteredCardsResult;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    // Don't do anything where there is not destination
    if (!destination) {
      return;
    }

    // Do nothing if the card is put back where it was
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // If card is being dragged
    if (type === 'card') {
      await saveCardSequence(destination.index, destination.droppableId, draggableId);
    }

    // If column is being dragged
    if (type === 'column') {
      await saveColumnSequence(destination.index, draggableId);
    }
  };

   const saveCardSequence = async (
     destinationIndex: number,
     destinationColumnId: string,
     cardId: string
   ) => {
     const cardsFromColumn = cards.filter(
       (card) => card.columnId === destinationColumnId && card._id !== cardId
     );
     const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence);
 
     let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;
 
     const patchCard = {
       _id: cardId,
       sequence,
       columnId: destinationColumnId
     };
 
     // This is just for updating local state so that there won't be any lag after saving the sequence and fetching again
     // Now we don't to fetch the cards again
     await dispatch(updateCardSequenceToLocalState(patchCard));
     await dispatch(updateCardSequence(patchCard));
 
     for (let i = destinationIndex; i < sortedCards.length; i++) {
       const card = sortedCards[i];
       sequence += 1;
 
       const patchCard = {
         _id: card._id,
         sequence,
         columnId: destinationColumnId
       };
 
       await dispatch(updateCardSequenceToLocalState(patchCard));
       await dispatch(updateCardSequence(patchCard));
     }
     
     // Reapply filters after card movement to ensure the filtered cards state is up to date
     await dispatch(applySearchFilters());
   };

  const saveColumnSequence = async (destinationIndex: number, columnId: string) => {
    // Remove the column which is dragged from the list
    const filteredColumns = columns.filter((column) => column._id !== columnId);

    const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);

    let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;

    const patchColumn = {
      _id: columnId,
      sequence
    };

    // This is just for updating local state so that there won't be any lag after saving the sequence and fetching again
    await dispatch(updateColumnSequenceToLocalState(patchColumn));
    await dispatch(updateColumnSequence(patchColumn));

    for (let i = destinationIndex; i < sortedColumns.length; i++) {
      const column = sortedColumns[i];

      sequence += 1;

      const patchColumn = {
        _id: column._id,
        sequence
      };

      await dispatch(updateColumnSequenceToLocalState(patchColumn));
      await dispatch(updateColumnSequence(patchColumn));
    }

    // Added temporarily to refresh the page on column, otherwise it will not reflect the changes
    // Will be fixed later
    window.location.reload();
  };

  // Handle search and filter changes
  const handleSearchChange = (searchText: string) => {
    dispatch(updateSearchFilters({ ...searchFilters, searchText }));
    dispatch(applySearchFilters());
  };

  const handleLabelFilterChange = (labels: string[]) => {
    dispatch(updateSearchFilters({ ...searchFilters, labels }));
    dispatch(applySearchFilters());
  };

  const handleAssigneeFilterChange = (assignees: string[]) => {
    dispatch(updateSearchFilters({ ...searchFilters, assignees }));
    dispatch(applySearchFilters());
  };

  const handleDueDateFilterChange = (dueDate: string) => {
    dispatch(updateSearchFilters({ ...searchFilters, dueDate }));
    dispatch(applySearchFilters());
  };

 return (
    <>
      <SearchFilters
        onSearchChange={handleSearchChange}
        onLabelFilterChange={handleLabelFilterChange}
        onAssigneeFilterChange={handleAssigneeFilterChange}
        onDueDateFilterChange={handleDueDateFilterChange}
      />
      <Box sx={{ p: 2, height: 'calc(100vh - 150px)', overflowY: 'auto' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <Grid
                container
                spacing={2}
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ flexWrap: 'nowrap', overflowX: 'auto', pb: 2 }}
              >
                {columns.map((column, index) => (
                  <Grid item key={column._id}>
                    <Column
                      column={column}
                      id={column._id}
                      index={index}
                      cards={filterCards(column._id)}
                      showCardDetail={showCardDetail}
                    />
                  </Grid>
                ))}
                {provided.placeholder}
                <Grid item>
                  <AddColumnButton addColumn={addColumn} />
                </Grid>
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
        {isOpen && <CardDetailsModal isOpen={isOpen} onClose={onClose} card={cardDetail} />}
      </Box>
    </>
  );
};

export default BoardColumns;
