using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace Onyx.BL.Services;

public class RabbitMQProducer : IRabbitMQProducer
{
    public async Task SendMessageAsync<T>(T message)
    {
        var factory = new ConnectionFactory { HostName = "localhost" };

        // 1. Create Connection (Async)
        using var connection = await factory.CreateConnectionAsync();
        
        // 2. Create Channel (Async) - "Model" is now called "Channel" in v7
        using var channel = await connection.CreateChannelAsync();

        // 3. Declare Queue
        await channel.QueueDeclareAsync(queue: "task_updates",
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null);

        // 4. Serialize
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);

        // 5. Publish (Async)
        // Note: The arguments order changed slightly in v7
        await channel.BasicPublishAsync(exchange: "",
            routingKey: "task_updates",
            mandatory: false, 
            basicProperties: new BasicProperties(), 
            body: body);
    }
}