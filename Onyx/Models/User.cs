using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Onyx.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }
        
        [MaxLength(6)]
        public string? VerificationCode { get; set; }

        // Relationship: One User -> Many Tasks
        public ICollection<TaskItem>? Tasks { get; set; }
    }
}