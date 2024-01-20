namespace API.Dtos;

public class TaskDetails
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; } = null;
}
