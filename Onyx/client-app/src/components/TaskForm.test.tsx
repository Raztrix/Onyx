import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import CreateTaskForm from './CreateTaskForm';

// --- 1. MOCK THE SLICES (Use Correct Paths: Singular!) ---
vi.mock('../features/tasks/taskSlice', () => ({
  addTask: vi.fn((payload) => ({
    type: 'tasks/addTask',
    payload,
  })),
}));

vi.mock('../features/tags/tagSlice', () => ({
  createTag: vi.fn((name) => ({
    type: 'tags/createTag',
    payload: { id: 99, name },
  })),
  // We also need to mock fetchTags since your component calls it in useEffect
  fetchTags: vi.fn(() => ({ type: 'tags/fetchTags' })),
}));

// --- 2. IMPORT THE MOCKED FUNCTIONS ---
// Ensure these match the mock paths above
import { addTask } from '../features/tasks/taskSlice';
import { createTag } from '../features/tags/tagSlice';

// --- 3. MOCK REDUX ---
const mockDispatch = vi.fn((action) => {
  return {
    unwrap: () => Promise.resolve(action?.payload || {}),
  };
});

vi.mock('react-redux', () => ({
  useSelector: (selector: any) =>
    selector({
      tags: {
        items: [{ id: 1, name: 'Work' }],
        status: 'succeeded',
      },
      tasks: { items: [], status: 'idle' },
    }),
  useDispatch: () => mockDispatch,
  useAppDispatch: () => mockDispatch,
}));

describe('CreateTaskForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const openForm = async (user: any) => {
    const newButton = screen.getByRole('button', { name: /\+ New Task/i });
    await user.click(newButton);
  };

  it('renders the form correctly', async () => {
    render(<CreateTaskForm />);
    const user = userEvent.setup();
    await openForm(user);

    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
    // Use the label text matcher for the Autocomplete
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
  });

  it('updates title when user types', async () => {
    render(<CreateTaskForm />);
    const user = userEvent.setup();
    await openForm(user);

    const input = screen.getByLabelText(/Task Title/i);
    await user.type(input, 'Finish the project');
    expect(input).toHaveValue('Finish the project');
  });

  it('dispatches addTask action on submit', async () => {
    render(<CreateTaskForm />);
    const user = userEvent.setup();
    await openForm(user);

    // 1. Fill Title
    await user.type(screen.getByLabelText(/Task Title/i), 'New Redux Task');

    // 2. Click Create
    await user.click(screen.getByRole('button', { name: /Create/i }));

    // 3. Verify
    expect(mockDispatch).toHaveBeenCalled();

    // Cast to Mock so TS is happy.
    // Since the path is correct now, this will be a real spy at runtime.
    expect(addTask as unknown as Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Redux Task',
      }),
    );
  });

  it('handles "FreeSolo" tag creation', async () => {
    render(<CreateTaskForm />);
    const user = userEvent.setup();
    await openForm(user);

    // Target the Autocomplete input specifically
    const tagInput = screen.getByLabelText(/Tags/i);

    // Type and Enter
    await user.type(tagInput, 'Urgent{enter}');

    expect(createTag as unknown as Mock).toHaveBeenCalledWith('Urgent');
  });
});
