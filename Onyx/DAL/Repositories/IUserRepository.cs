using Onyx.Models;

namespace Onyx.DAL.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByPhoneAsync(string phone);
        Task AddUserAsync(User user);
        Task UpdateVerificationCodeAsync(int userId, string code);
        Task ClearVerificationCodeAsync(int userId);
    }
}