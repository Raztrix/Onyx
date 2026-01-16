using Microsoft.EntityFrameworkCore;
using Onyx.Data;
using Onyx.Models;

namespace Onyx.DAL.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
    {
        return await _context.Tasks
            .Include(t => t.User)           // 1. Get the User
            .Include(t => t.TaskTags)       // 2. Get the link table
            .ThenInclude(tt => tt.Tag)  // 3. Get the Tag names
            .ToListAsync();
    }
    
    public async Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId)
    {
        return await _context.Tasks
            .Where(t => t.UserId == userId)   // <--- The Filter!
            .Include(t => t.User)             // 1. Get the User details
            .Include(t => t.TaskTags)         // 2. Get the link table
            .ThenInclude(tt => tt.Tag)    // 3. Get the Tag names
            .OrderByDescending(t => t.Id)     // Optional: Show newest tasks first
            .ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        return await _context.Tasks
            .Include(t => t.User)     // <--- Load User details
            .Include(t => t.TaskTags)
            .ThenInclude(tt => tt.Tag)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task AddTaskAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateTaskAsync(TaskItem task)
    {
       
        var existingTask = await _context.Tasks
            .Include(t => t.TaskTags)
            .FirstOrDefaultAsync(t => t.Id == task.Id);

        if (existingTask == null) return;

        // 2. Update basic fields
        existingTask.Title = task.Title;
        existingTask.Description = task.Description;
        existingTask.Priority = task.Priority;
        existingTask.IsCompleted = task.IsCompleted;
        existingTask.DueDate = task.DueDate;

        if (existingTask.TaskTags is not null && existingTask.TaskTags.Count > 0)
        {
            existingTask.TaskTags.Clear();
        }
        
        

        // Add the new ones
        if (task.TaskTags != null)
        {
            
            foreach (var tt in task.TaskTags)
            {
                // Ensure we use the IDs
                existingTask.TaskTags?.Add(new TaskTag 
                { 
                    TaskId = task.Id, 
                    TagId = tt.TagId 
                });
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task != null)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
}