using Onyx.DAL.Repositories;
using Onyx.Models;

namespace Onyx.BL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // 1. Register Logic
        public async Task<User> RegisterAsync(User user)
        {
            var existing = await _userRepository.GetByPhoneAsync(user.Phone);
            if (existing != null) throw new Exception("Phone already registered");

            await _userRepository.AddUserAsync(user);
            return user;
        }

        // 2. Send Code Logic (Returns the code for Dev Mode)
        public async Task<string> GenerateLoginCodeAsync(string phone)
        {
            var user = await _userRepository.GetByPhoneAsync(phone);
            if (user == null) throw new Exception("User not found");

            // Generate Random 6-digit code
            var code = new Random().Next(100000, 999999).ToString();

            // Save to DB
            await _userRepository.UpdateVerificationCodeAsync(user.Id, code);

            return code; // Return it so Controller can send it to Frontend
        }

        // 3. Login Logic
        public async Task<User?> LoginAsync(string phone, string code)
        {
            var user = await _userRepository.GetByPhoneAsync(phone);
            
            if (user == null || user.VerificationCode != code)
            {
                return null; // Fail
            }

            // Success! Clear the code so it can't be reused
            await _userRepository.ClearVerificationCodeAsync(user.Id);
            return user;
        }
    }
}