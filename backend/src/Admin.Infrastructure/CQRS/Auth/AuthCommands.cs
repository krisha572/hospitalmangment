using backend.Data;
using backend.DTOs;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.CQRS.Auth;

public class LoginCommand : IRequest<AuthResponseDto?>
{
    public LoginDto LoginDto { get; }
    public LoginCommand(LoginDto loginDto) => LoginDto = loginDto;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto?>
{
    private readonly HospitalDbContext _context;
    private readonly IConfiguration _config;

    public LoginCommandHandler(HospitalDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u =>
                u.Username == request.LoginDto.Username || u.Email == request.LoginDto.Username,
                cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.LoginDto.Password, user.PasswordHash))
            return null;

        if (!user.IsActive) return null;

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        var expiry = DateTime.UtcNow.AddMinutes(int.Parse(_config["JwtSettings:ExpiryMinutes"] ?? "60"));

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(int.Parse(_config["JwtSettings:RefreshTokenExpiryDays"] ?? "7"));
        user.LastLogin = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Expiry = expiry,
            User = new UserInfoDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role.Name,
                ProfilePhoto = user.ProfilePhoto
            }
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.Name),
            new Claim("fullName", user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpiryMinutes"] ?? "60")),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}

// ── Register Command ──────────────────────────────────────────────────────────
public class RegisterCommand : IRequest<bool>
{
    public RegisterDto RegisterDto { get; }
    public RegisterCommand(RegisterDto dto) => RegisterDto = dto;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, bool>
{
    private readonly HospitalDbContext _context;

    public RegisterCommandHandler(HospitalDbContext context) => _context = context;

    public async Task<bool> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users.AnyAsync(u =>
            u.Username == request.RegisterDto.Username || u.Email == request.RegisterDto.Email, cancellationToken);
        if (exists) return false;

        var user = new User
        {
            Username = request.RegisterDto.Username,
            Email = request.RegisterDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.RegisterDto.Password),
            FullName = request.RegisterDto.FullName,
            Phone = request.RegisterDto.Phone,
            RoleId = request.RegisterDto.RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
