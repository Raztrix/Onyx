using System.ComponentModel.DataAnnotations;

namespace Onyx.Models
{
    public class Tag
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        // Relationship: A Tag belongs to many Tasks
        public ICollection<TaskTag>? TaskTags { get; set; }
    }
}