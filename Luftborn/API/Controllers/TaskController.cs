using API.Dtos;
using API.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController, Authorize]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public TaskController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }


    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {   
        
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        var tasks = await _unitOfWork.Tasks.GetAll(q => q.UserId == userId, includes: new List<string> {"User"});
        
        var taskDetails = tasks.Select(task => new TaskDetails
        {
            Id = task.Id,
            Description = task.Description,
            IsComplete = task.IsComplete,
            CreatedAt = task.CreatedAt,
            CompletedAt = task.CompletedAt
        }).ToList();

        return Ok(taskDetails);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var task = await _unitOfWork.Tasks.Get(q => q.Id == id);
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;

        if (task == null)
        {
            return NotFound();
        }

        if (userId != task.UserId)
        {
            return Unauthorized();
        }

        var taskDetails = new TaskDetails
        {
            Id = task.Id,
            Description = task.Description,
            IsComplete = task.IsComplete,
            CreatedAt = task.CreatedAt,
            CompletedAt = task.CompletedAt
        };

        return Ok(taskDetails);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTask([FromBody] TaskDto taskDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var task = new Models.Task
        {
            Description = taskDto.Description,
            IsComplete = taskDto.IsComplete,
            CreatedAt = DateTime.Now,
            UserId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value
        };

        await _unitOfWork.Tasks.Insert(task);
        await _unitOfWork.Save();

        return CreatedAtAction("GetTask", new {id = task.Id}, task);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskDto taskDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var task = await _unitOfWork.Tasks.Get(q => q.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (userId != task.UserId)
        {
            return Unauthorized();
        }

        task.Description = taskDto.Description;
        task.IsComplete = taskDto.IsComplete;

        if(taskDto.IsComplete)
        {
            task.CompletedAt = DateTime.Now;
        }
        else
        {
            task.CompletedAt = null;
        }

        _unitOfWork.Tasks.Update(task);

        await _unitOfWork.Save();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _unitOfWork.Tasks.Get(q => q.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        // check if the user id == the user id of the task
        var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (userId != task.UserId)
        {
            return Unauthorized();
        }

        await _unitOfWork.Tasks.Delete(id);
        await _unitOfWork.Save();

        return NoContent();
    }
}