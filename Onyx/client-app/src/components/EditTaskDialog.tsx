import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { updateTaskDetails } from '../features/tasks/taskSlice';
import { createTag, fetchTags } from '../features/tags/tagSlice';
import type { Tag, TaskItem } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  task: TaskItem;
}

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return '';
  return dateString.split('T')[0]; // Takes "2023-10-25T14:00..." and keeps "2023-10-25"
};

export default function EditTaskDialog({ open, onClose, task }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  // Get all available tags from Redux to show in the list
  const allTags = useSelector((state: RootState) => state.tags.items);

  // Form State
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [dueDate, setDueDate] = useState(formatDateForInput(task.dueDate));

  // For tags, we manage the list of "Selected Tags"
  const [selectedTags, setSelectedTags] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      // Load tags when dialog opens
      dispatch(fetchTags());

      // Sync state with prop
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority || 'Medium');
      setDueDate(formatDateForInput(task.dueDate));

      // Convert TaskTags (Backend format) to simple Tag objects for the UI
      const currentTags =
        task.taskTags?.map((tt) => tt.tag).filter((t) => t !== null && t !== undefined) || [];
      setSelectedTags(currentTags);
    }
  }, [task, open, dispatch]);

  const handleTagsChange = async (_event: any, newValue: (string | Tag)[]) => {
    const lastItem = newValue[newValue.length - 1];

    // CASE 1: User typed a NEW string and hit Enter
    if (typeof lastItem === 'string') {
      // 1. Optimistically add it to UI (optional, but feels faster)
      // setSelectedTags([...selectedTags, { id: 0, name: lastItem }]);

      try {
        // 2. Dispatch API Call immediately
        // unwrap() allows us to get the actual returned Tag object
        const newRealTag = await dispatch(createTag(lastItem)).unwrap();

        // 3. Update state with the REAL backend object (now has ID)
        setSelectedTags((prev) => [...prev, newRealTag]);
      } catch (error) {
        console.error('Failed to create tag', error);
        // Optionally show error toast
      }
    }
    // CASE 2: User selected an EXISTING tag (Object)
    else {
      // Just update the state normally
      // We cast newValue to Tag[] because we handled the string case above
      const validTags = newValue.filter((x) => typeof x !== 'string') as Tag[];
      setSelectedTags(validTags);
    }
  };

  const handleSave = () => {
    const newTaskTags = selectedTags.map((tag) => ({
      taskId: task.id,
      tagId: tag.id,
      tag: tag,
    }));

    const updatedTask: TaskItem = {
      ...task,
      title,
      description,
      priority,
      dueDate: dueDate ? dueDate : '',
      taskTags: newTaskTags,
    };

    dispatch(updateTaskDetails(updatedTask));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {/* Title */}
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Priority Dropdown */}
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          fullWidth
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        {/* Due Date Input */}
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          // This forces the label to stay up (doesn't overlap the text)
          slotProps={{ inputLabel: { shrink: true } }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          sx={{ mt: 2 }} // Add a little margin top
        />
        <Autocomplete
          freeSolo
          multiple
          options={allTags}
          getOptionLabel={(option) => {
            // Handle case where option is a string (user typed new tag)
            if (typeof option === 'string') return option;
            return option.name;
          }}
          value={selectedTags}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleTagsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              placeholder="Type & Enter to Create..."
              helperText="Press Enter to create a new tag immediately"
            />
          )}
          renderValue={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  variant="outlined"
                  // Handle potential temp state (string) vs real object
                  label={typeof option === 'string' ? option : option.name}
                  key={key}
                  {...tagProps}
                />
              );
            })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
