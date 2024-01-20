using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if(!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var authResponse = await _authService.RegisterAsync(model);

        if(!authResponse.IsAuthenticated)
        {
            return BadRequest(authResponse.Message);
        }

        return Ok(authResponse);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
    {
        if(!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var authResponse = await _authService.LoginAsync(model);

        if(!authResponse.IsAuthenticated)
        {
            return BadRequest(authResponse.Message);
        }

        return Ok(new {authResponse.Token, authResponse.Expiration});
    }
}