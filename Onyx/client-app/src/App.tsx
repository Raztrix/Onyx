import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, fetchTasks } from './features/tasks/taskSlice';
import { logout } from './features/auth/authSlice'; // <--- Import Logout
import type { RootState, AppDispatch } from './store';
import {
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';

// Components
import TaskCard from './components/TaskCard';
import CreateTaskForm from './components/CreateTaskForm';
import LoginPage from './components/LoginPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Get Auth State
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items: tasks, status, error } = useSelector((state: RootState) => state.tasks);

  // 2. Fetch Tasks only if logged in
  useEffect(() => {
    if (isAuthenticated && user?.id && status === 'idle') {
      dispatch(fetchTasks(user.id));
    }
  }, [status, dispatch, user, isAuthenticated]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  // 3. AUTH GUARD: If not logged in, show Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 4. MAIN DASHBOARD (Only shown if logged in)
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Onyx Task Manager
          </Typography>

          {/* Logout Button */}
          <Button color="inherit" onClick={() => dispatch(logout())}>
            Logout ({user?.fullName})
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">My Tasks</Typography>

          {/* Pass User ID to Form */}
          <CreateTaskForm currentUserId={user?.id || 0} />
        </Box>

        {status === 'loading' && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {status === 'failed' && <Typography color="error">Error: {error}</Typography>}

        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} key={task.id}>
              <TaskCard task={task} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
