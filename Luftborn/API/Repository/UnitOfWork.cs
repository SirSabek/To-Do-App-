using API.IRepository;
using API.Models;
using Task = System.Threading.Tasks.Task;

namespace API.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IGenericRepository<User> _users;
    private IGenericRepository<Models.Task> _tasks;



    public UnitOfWork(ApplicationDbContext context, IGenericRepository<User> users)
    {
        _context = context;
        _users = users;
    }

    public IGenericRepository<User> Users => _users ??= new GenericRepository<User>(_context);

    public IGenericRepository<Models.Task> Tasks => _tasks ??= new GenericRepository<Models.Task>(_context);

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}
