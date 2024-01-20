using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Helpers;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JWT _jwt;

    public AuthService(UserManager<User> userManager, IOptions<JWT> jwt, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _jwt = jwt.Value;
        _roleManager = roleManager;
    }

    public async Task<AuthModel> RegisterAsync(RegisterModel model)
    {
        if(await _userManager.FindByEmailAsync(model.Email) is not null)
        {
            return new AuthModel
            {
                Message = "Email already exists",
                IsAuthenticated = false
            };
        }

        if(await _userManager.FindByNameAsync(model.Username) is not null)
        {
            return new AuthModel
            {
                Message = "Username already exists",
                IsAuthenticated = false
            };
        }

        var user = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            UserName = model.Username,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if(!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            var errorsString = string.Join(", ", errors);

            return new AuthModel
            {
                Message = errorsString,
                IsAuthenticated = false
            };
        }

        await _userManager.AddToRoleAsync(user, "User");

        var jwtSecurityToken = await CreateJwtToken(user);

        //add this token to user tokens 
        //await _userManager.SetAuthenticationTokenAsync(user, "jwt", "Token", new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken));


        return new AuthModel
        {
            Message = "User created successfully!",
            IsAuthenticated = true,
            Username = user.UserName,
            Email = user.Email,
            Role = "User",
            Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
            Expiration = jwtSecurityToken.ValidTo
        };
    }
    public async Task<AuthModel> LoginAsync(LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if(user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return new AuthModel
            {
                Message = "Email or Password is wrong!",
                IsAuthenticated = false
            };
        }

        var jwtSecurityToken = await CreateJwtToken(user);

        return new AuthModel
        {
            Message = "Login successful!",
            Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
            IsAuthenticated = true,
            Expiration = jwtSecurityToken.ValidTo

        };
    }

    private async Task<JwtSecurityToken> CreateJwtToken(User user)
    {
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        var roleClaims = roles.Select(r => new Claim("roles", r)).ToList();

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("uid", user.Id)
        }
        .Union(userClaims)
        .Union(roleClaims);

        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwt.DurationInDays),
            signingCredentials: signingCredentials
        );

        return jwtSecurityToken;
    }
}