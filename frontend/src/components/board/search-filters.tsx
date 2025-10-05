import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { useAppSelector } from '@/hooks';

type SearchFiltersProps = {
  onSearchChange: (searchText: string) => void;
  onLabelFilterChange: (labels: string[]) => void;
  onAssigneeFilterChange: (assignees: string[]) => void;
  onDueDateFilterChange: (dueDate: string) => void;
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearchChange,
  onLabelFilterChange,
  onAssigneeFilterChange,
  onDueDateFilterChange
}) => {
  const cards = useAppSelector((state) => state.cards.cards);
  const users = useAppSelector((state) => state.users.users);
  
  // Extract unique labels from cards
  const allLabels = Array.from(
    new Set(
      (Array.isArray(cards) ? cards
        .filter(card => card.label && card.label.type)
        .map(card => card.label!.type) : [])
    )
  );

  // Extract unique assignees from cards
  const allAssignees = Array.from(
    new Set(
      (Array.isArray(cards) ? cards
        .filter(card => card.assignedTo)
        .map(card => card.assignedTo!) : [])
    )
 );

  const [searchText, setSearchText] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Debounced search to avoid excessive updates
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchText);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText, onSearchChange]);

  const handleLabelChange = (event: SelectChangeEvent<string[]>) => {
    const value = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    setSelectedLabels(value);
    onLabelFilterChange(value);
  };

  const handleAssigneeChange = (event: any) => {
    const value = event.target.value as string[];
    setSelectedAssignees(value);
    onAssigneeFilterChange(value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Search Input */}
      <TextField
        label="Search cards..."
        variant="outlined"
        size="small"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ minWidth: 250 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Label Filter */}
      {allLabels.length > 0 && (
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Labels</InputLabel>
          <Select
            multiple
            value={selectedLabels}
            onChange={handleLabelChange}
            input={<OutlinedInput label="Labels" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {allLabels.map((label) => (
              <MenuItem key={label} value={label}>
                <Checkbox checked={selectedLabels.indexOf(label) > -1} />
                <ListItemText primary={label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Assignee Filter */}
      {allAssignees.length > 0 && (
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Assignees</InputLabel>
          <Select
            multiple
            value={selectedAssignees}
            onChange={handleAssigneeChange}
            input={<OutlinedInput label="Assignees" />}
            renderValue={(selected) => {
              const selectedUsers = users.filter(user => selected.includes(user._id));
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedUsers.map((user) => (
                    <Chip key={user._id} label={user.fullName} size="small" />
                  ))}
                </Box>
              );
            }}
          >
            {allAssignees.map((assigneeId) => {
              const user = users.find(u => u._id === assigneeId);
              return user ? (
                <MenuItem key={assigneeId} value={assigneeId}>
                  <Checkbox checked={selectedAssignees.indexOf(assigneeId) > -1} />
                  <ListItemText primary={user.fullName} />
                </MenuItem>
              ) : null;
            })}
          </Select>
        </FormControl>
      )}

      {/* Due Date Filter - Placeholder for now */}
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel>Due Date</InputLabel>
        <Select
          value=""
          onChange={(e) => onDueDateFilterChange(e.target.value as string)}
          label="Due Date"
        >
          <MenuItem value="">All Dates</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="this-week">This Week</MenuItem>
          <MenuItem value="this-month">This Month</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchFilters;