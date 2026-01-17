import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../features/tasks/taskSlice';
import { createTag, fetchTags } from '../features/tags/tagSlice';
import type { AppDispatch, RootState } from '../store';
import type { Tag } from '../types';

interface FormData {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  userId: number;
}

interface CreateTaskFormProps {
  currentUserId?: number;
}

export default function CreateTaskForm({ currentUserId }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // 1. Get available tags from Redux
  const { items: availableTags } = useSelector((state: RootState) => state.tags);

  // 2. Local state for the selected tags (Array of full Tag objects)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    userId: 1,
  });

  // 3. Fetch tags from backend when dialog opens
  useEffect(() => {
    if (open) {
      dispatch(fetchTags());
    }
  }, [open, dispatch]);

  const handleTagsChange = async (event: any, newValue: (string | Tag)[]) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // 4. Transform Selected Tags to Backend Format
    // The backend expects "taskTags": [ { "tagId": 1 }, { "tagId": 2 } ]
    const apiTaskTags = selectedTags.map((tag) => ({
      tagId: tag.id,
      taskId: 0, // Ignored by server on creation
    }));

    dispatch(
      addTask({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        taskTags: apiTaskTags,
        userId: currentUserId,
      }),
    );

    setOpen(false);
    setFormData((prev) => ({ ...prev, title: '', description: '' }));
    setSelectedTags([]);
  };

  return (
    <div>
      <Button variant="contained" size="large" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
        + New Task
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="title"
                label="Task Title"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                multiple
                options={availableTags}
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
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      // Handle potential temp state (string) vs real object
                      label={typeof option === 'string' ? option : option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                name="priority"
                label="Priority"
                fullWidth
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="dueDate"
                label="Due Date"
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
