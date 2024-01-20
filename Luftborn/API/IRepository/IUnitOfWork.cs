using API.Models;

namespace API.IRepository;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<Models.Task> Tasks { get; }
    System.Threading.Tasks.Task Save();
}

