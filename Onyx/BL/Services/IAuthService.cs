using Onyx.Models;

namespace Onyx.BL.Services
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(User user);
        Task<string> GenerateLoginCodeAsync(string phone);
        Task<User?> LoginAsync(string phone, string code);
    }
}