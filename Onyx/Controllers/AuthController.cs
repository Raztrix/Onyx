using Microsoft.AspNetCore.Mvc;
using Onyx.BL.Services;
using Onyx.Models;

namespace Onyx.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                var newUser = await _authService.RegisterAsync(user);
                return CreatedAtAction("Login", new { id = newUser.Id }, newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("send-code")]
        public async Task<IActionResult> SendCode([FromBody] string phone)
        {
            try
            {
                // The Service generates the code and saves it
                var code = await _authService.GenerateLoginCodeAsync(phone);
                
                // We return it to the frontend (Dev Mode)
                return Ok(new { message = "Code sent", devCode = code });
            }
            catch (Exception)
            {
                return NotFound("User not found");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.LoginAsync(request.Phone, request.Code);
            
            if (user == null) return BadRequest("Invalid code or phone");

            return Ok(user);
        }
    }

    public class LoginRequest
    {
        public string Phone { get; set; }
        public string Code { get; set; }
    }
}