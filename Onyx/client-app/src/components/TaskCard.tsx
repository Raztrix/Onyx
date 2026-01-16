import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Checkbox,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import type { TaskItem } from '../types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { toggleTaskStatus } from '../features/tasks/taskSlice';
import EditIcon from '@mui/icons-material/Edit';
import EditTaskDialog from './EditTaskDialog';

interface TaskCardProps {
  task: TaskItem;
  onDelete: (id: number) => void;
}

const getPriorityColor = (priority: string): 'error' | 'warning' | 'success' | 'default' => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card
        sx={{
          minWidth: 275,
          mb: 2,
          boxShadow: 3,
          borderRadius: 2,
          opacity: task.isCompleted ? 0.6 : 1,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={task.isCompleted}
              onChange={() => dispatch(toggleTaskStatus(task))}
              color="primary"
            />
            <Typography
              variant="h6"
              sx={{
                textDecoration: task.isCompleted ? 'line-through' : 'none',
                color: task.isCompleted ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div" fontWeight="bold">
              {task.title}
            </Typography>
            <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
          </Box>

          <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="body2">
            {task.description || 'No description provided.'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {task.taskTags?.map((tt) => (
                <Chip
                  key={tt.tagId}
                  label={tt.tag?.name || 'Tag'}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5 }}
                />
              ))}
            </Box>
            <Stack direction="row">
              <IconButton onClick={() => setIsEditOpen(true)} color="primary">
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => onDelete(task.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Box>

          {task.user && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#999' }}>
              Assigned to: {task.user.fullName}
            </Typography>
          )}
        </CardContent>
      </Card>
      {/* The Edit Dialog (Hidden by default) */}
      <EditTaskDialog open={isEditOpen} onClose={() => setIsEditOpen(false)} task={task} />
    </>
  );
};

export default TaskCard;
