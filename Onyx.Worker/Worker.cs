using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Onyx.Worker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private IConnection _connection;
    private IChannel _channel;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    // 1. Setup: This runs ONCE when the service starts
    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        // Connect to RabbitMQ
        var factory = new ConnectionFactory { HostName = "localhost" };
        
        // Create Connection and Channel (Async)
        _connection = await factory.CreateConnectionAsync(cancellationToken);
        _channel = await _connection.CreateChannelAsync(null, cancellationToken);

        // Declare the same queue name (to be safe)
        await _channel.QueueDeclareAsync(queue: "TaskExpired",
                                    durable: false,
                                    exclusive: false,
                                    autoDelete: false,
                                    arguments: null);

        _logger.LogInformation("Waiting for messages in 'TaskExpired'...");

        await base.StartAsync(cancellationToken);
    }

    // 2. Execution: This runs in the background
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = new AsyncEventingBasicConsumer(_channel);

        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var jsonString = Encoding.UTF8.GetString(body);

            try 
            {
                // 1. Convert JSON string back to C# Object
                var message = JsonSerializer.Deserialize<TaskMessage>(jsonString);

                // 2. Check the "Action" to see what kind of message it is
                if (message != null)
                {
                    // This is the specific logic you asked for:
                    _logger.LogInformation($"Hi, your task is due Task : {message.Title}");
                }
                else
                {
                    // Handle other messages (like updates) differently
                    _logger.LogInformation($" [x] General Update: {jsonString}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Could not parse message: {ex.Message}");
            }
            
            await Task.CompletedTask;
        };

        await _channel.BasicConsumeAsync(queue: "TaskExpired",
            autoAck: true,
            consumer: consumer);
        
        await Task.Delay(-1, stoppingToken);
    }
    

    // 3. Cleanup: Close connections when app stops
    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_channel != null) await _channel.CloseAsync(cancellationToken);
        if (_connection != null) await _connection.CloseAsync(cancellationToken);
        
        await base.StopAsync(cancellationToken);
    }
    
    public record TaskMessage(int TaskId, string Title, string Action, DateTime Timestamp);
}