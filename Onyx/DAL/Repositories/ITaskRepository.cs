using Onyx.Models;

namespace Onyx.DAL.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId);
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task AddTaskAsync(TaskItem task);
    Task UpdateTaskAsync(TaskItem task);
    Task DeleteTaskAsync(int id);
    Task<bool> TryMarkReminderAsSentAsync(int taskId);
}