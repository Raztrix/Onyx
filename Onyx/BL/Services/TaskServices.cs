using Onyx.DAL.Repositories;
using Onyx.Models;

namespace Onyx.BL.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;
        private readonly IRabbitMQProducer _producer;

        public TaskService(ITaskRepository repository,  IRabbitMQProducer producer)
        {
            _repository = repository;
            _producer = producer;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await _repository.GetAllTasksAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId)
        {
            IEnumerable<TaskItem> tasks =  await _repository.GetTasksByUserIdAsync(userId);
            
            foreach (var task in tasks)
            {
                if (task.DueDate.HasValue && 
                    task.DueDate.Value < DateTime.Now 
                    && !task.IsReminderSent)
                {
                    // handles the refresh spamming problem.
                    // if we have 3 workers instances the RabbitMQ deals with it automatically.
                    bool updateIsReminderSent = await _repository.TryMarkReminderAsSentAsync(task.Id);
                    if (updateIsReminderSent)
                    {
                        // Create a specific "Reminder" message
                        var message = new 
                        { 
                            TaskId = task.Id, 
                            Title = task.Title,
                            Action = "TaskExpired", // Different action name!
                            Timestamp = DateTime.Now 
                        };

                        // Send to Queue (Fire and forget - don't wait too long)
                        try 
                        {
                            // We use await here to ensure it sends, 
                            // but typically this is very fast (milliseconds)
                            await _producer.SendMessageAsync(message);
                        }
                        catch (Exception ex)
                        {
                            // If RabbitMQ is down, we swallow the error so the user isn't affected.
                            // In a real app, you would log this: _logger.LogError(ex, "Failed to send queue message");
                            Console.WriteLine($"Queue Error: {ex.Message}");
                        }
                    }

                }
            }
            
            return tasks;
        }

        public async Task<TaskItem?> GetTaskByIdAsync(int id)
        {
            return await _repository.GetTaskByIdAsync(id);
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItem task, List<int> tagIds)
        {
            task.TaskTags = new List<TaskTag>();
            if (tagIds.Any())
            {
                foreach (var tagId in tagIds)
                {
                    task.TaskTags.Add(new TaskTag { TagId = tagId });
                }
            }

            await _repository.AddTaskAsync(task);
            return task;
        }

        public async Task UpdateTaskAsync(TaskItem task)
        {
            await _repository.UpdateTaskAsync(task);
            
        }

        public async Task DeleteTaskAsync(int id)
        {
            await _repository.DeleteTaskAsync(id);
        }
    }
}