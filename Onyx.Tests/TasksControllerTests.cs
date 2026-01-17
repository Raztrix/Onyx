using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Onyx.Controllers;
using Onyx.BL.Services; 
using Onyx.Models;

namespace Onyx.Tests.Controllers
{
    public class TasksControllerTests
    {
        // 1. The Mock (Fake Service)
        private readonly Mock<ITaskService> _mockService;
        
        // 2. The Real Controller
        private readonly TasksController _controller;

        public TasksControllerTests()
        {
            _mockService = new Mock<ITaskService>();
            
            // Inject the fake service into the real controller
            _controller = new TasksController(_mockService.Object);
        }

        // --- GET TASKS TESTS ---

        [Fact]
        public async Task GetTasks_WithValidUserId_ReturnsOkResult()
        {
            // Arrange
            int userId = 1;
            var fakeTasks = new List<TaskItem> { new TaskItem { Id = 1, Title = "Test Task" } };
            
            _mockService.Setup(s => s.GetTasksByUserIdAsync(userId))
                        .ReturnsAsync(fakeTasks);

            // Act
            var result = await _controller.GetTasks(userId);

            // Assert
            // We verify the Result is of type OkObjectResult (HTTP 200)
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            
            // We verify the data inside matches our fake list
            var returnTasks = Assert.IsType<List<TaskItem>>(okResult.Value);
            Assert.Single(returnTasks);
        }

        [Fact]
        public async Task GetTasks_WithInvalidUserId_ReturnsBadRequest()
        {
            // Arrange
            int invalidUserId = 0;

            // Act
            var result = await _controller.GetTasks(invalidUserId);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        // --- GET SINGLE TASK TESTS ---

        [Fact]
        public async Task GetTask_Found_ReturnsOk()
        {
            // Arrange
            int taskId = 5;
            _mockService.Setup(s => s.GetTaskByIdAsync(taskId))
                        .ReturnsAsync(new TaskItem { Id = taskId, Title = "Found It" });

            // Act
            var result = await _controller.GetTask(taskId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var task = Assert.IsType<TaskItem>(okResult.Value);
            Assert.Equal("Found It", task.Title);
        }

        [Fact]
        public async Task GetTask_NotFound_ReturnsNotFound()
        {
            // Arrange
            int taskId = 99;
            _mockService.Setup(s => s.GetTaskByIdAsync(taskId))
                        .ReturnsAsync((TaskItem)null); // Service returns null

            // Act
            var result = await _controller.GetTask(taskId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // --- CREATE TASK TESTS ---

        [Fact]
        public async Task CreateTask_ValidItem_ReturnsCreatedAtAction()
        {
            // Arrange
            var newTask = new TaskItem 
            { 
                Title = "New Feature", 
                // Simulate incoming tags from frontend
                TaskTags = new List<TaskTag> { new TaskTag { TagId = 10 }, new TaskTag { TagId = 20 } }
            };

            // This is what the service returns after saving
            var savedTask = new TaskItem { Id = 100, Title = "New Feature" };

            // Setup mock to expect calls with ANY List<int>
            _mockService.Setup(s => s.CreateTaskAsync(newTask, It.IsAny<List<int>>()))
                        .ReturnsAsync(savedTask);

            // Act
            var result = await _controller.CreateTask(newTask);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            
            // 1. Check strict return code (201 Created)
            Assert.Equal(201, createdResult.StatusCode);
            
            // 2. Check it points to the "GetTask" method
            Assert.Equal(nameof(TasksController.GetTask), createdResult.ActionName);
            
            // 3. Check logic: Verify CreateTaskAsync was called with the correct extracted Tag IDs
            _mockService.Verify(s => s.CreateTaskAsync(newTask, It.Is<List<int>>(ids => ids.Contains(10) && ids.Contains(20))), Times.Once);
        }

        // --- UPDATE TASK TESTS ---

        [Fact]
        public async Task UpdateTask_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            int urlId = 1;
            var taskObj = new TaskItem { Id = 2 }; // Different ID

            // Act
            var result = await _controller.UpdateTask(urlId, taskObj);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task UpdateTask_Valid_ReturnsNoContent()
        {
            // Arrange
            int id = 5;
            var taskObj = new TaskItem { Id = 5, Title = "Updated" };

            // Act
            var result = await _controller.UpdateTask(id, taskObj);

            // Assert
            Assert.IsType<NoContentResult>(result); // HTTP 204
            
            // Verify service was called
            _mockService.Verify(s => s.UpdateTaskAsync(taskObj), Times.Once);
        }

        // --- DELETE TASK TESTS ---

        [Fact]
        public async Task DeleteTask_ReturnsNoContent()
        {
            // Arrange
            int id = 10;

            // Act
            var result = await _controller.DeleteTask(id);

            // Assert
            Assert.IsType<NoContentResult>(result); // HTTP 204
            
            // Verify service was called
            _mockService.Verify(s => s.DeleteTaskAsync(id), Times.Once);
        }
    }
}