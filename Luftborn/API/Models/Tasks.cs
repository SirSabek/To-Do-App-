using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Task
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; } = null;

    [ForeignKey("User")]
    public string UserId { get; set; }
    public User User { get; set; }
}
