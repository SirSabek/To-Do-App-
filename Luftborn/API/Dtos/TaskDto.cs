namespace API.Dtos;

public class TaskDto
{
    public string Description { get; set; }
    public bool IsComplete { get; set; } = false;
}