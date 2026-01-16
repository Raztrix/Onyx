using Onyx.Models;

namespace Onyx.BL.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId);
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<TaskItem> CreateTaskAsync(TaskItem task, List<int> tagIds);
    Task UpdateTaskAsync(TaskItem task);
    Task DeleteTaskAsync(int id);
}