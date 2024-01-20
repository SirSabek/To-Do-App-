using API.Models;

namespace API.Services;

public interface IAuthService
{
    Task<AuthModel> RegisterAsync(RegisterModel model);
    Task<AuthModel> LoginAsync(LoginModel model);
}