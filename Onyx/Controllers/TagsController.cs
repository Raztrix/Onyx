using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onyx.Data;
using Onyx.Models;

namespace Onyx.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
        {
            return await _context.Tags.ToListAsync();
        }
        
        [HttpPost]
        public async Task<ActionResult<Tag>> CreateTag([FromBody] TagDto dto)
        {
            // 1. Check if it already exists to avoid duplicates
            var existing = await _context.Tags
                .FirstOrDefaultAsync(t => t.Name.ToLower() == dto.Name.ToLower());
            
            if (existing != null) return Ok(existing);

            // 2. Create if new
            var tag = new Tag { Name = dto.Name };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTags), new { id = tag.Id }, tag);
        }
        
        public class TagDto { public string Name { get; set; } }
    }
}