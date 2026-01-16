namespace Onyx.BL.Services;

public interface IRabbitMQProducer
{
    Task SendMessageAsync<T>(T message);
}