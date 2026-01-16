using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace Onyx.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public DateTime? DueDate { get; set; }

        [Required] public string Priority { get; set; } = "Medium";
        

        // --- NEW RELATIONSHIP START ---
        
        // Foreign Key
        public int UserId { get; set; }

        // Navigation Property (The actual User object)
        public User? User { get; set; } // Nullable to avoid validation errors during simple creation
        

        public bool IsReminderSent { get; set; } = false;
        public bool IsCompleted { get; set; } = false;

        public ICollection<TaskTag>? TaskTags { get; set; }
    }
}