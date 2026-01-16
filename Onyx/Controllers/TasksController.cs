using Microsoft.AspNetCore.Mvc;
using Onyx.BL.Services;
using Onyx.Models;

namespace Onyx.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;

        public TasksController(ITaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks([FromQuery] int userId)
        {
            if (userId <= 0) 
            {
                return BadRequest("User ID is required.");
            }
            var tasks = await _service.GetTasksByUserIdAsync(userId);

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            // Extract tag IDs from the incoming request if they are sent inside the task object
            var tagIds = task.TaskTags?.Select(tt => tt.TagId).ToList() ?? new List<int>();
            
            var createdTask = await _service.CreateTaskAsync(task, tagIds);
            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem task)
        {
            if (id != task.Id) return BadRequest();
            
            await _service.UpdateTaskAsync(task);
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _service.DeleteTaskAsync(id);
            return NoContent();
        }
    }
}