using Microsoft.EntityFrameworkCore;
using Onyx.Data;
using Onyx.Models;

namespace Onyx.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Phone == phone);
        }

        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVerificationCodeAsync(int userId, string code)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.VerificationCode = code;
                await _context.SaveChangesAsync();
            }
        }
        
        public async Task ClearVerificationCodeAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.VerificationCode = null;
                await _context.SaveChangesAsync();
            }
        }
    }
}