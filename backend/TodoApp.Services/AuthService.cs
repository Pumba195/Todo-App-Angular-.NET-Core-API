using Microsoft.AspNetCore.Identity;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.DTOs;
using TodoApp.Services.Interfaces;
using TodoApp.Services.Exceptions;

namespace TodoApp.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        var existingUsername = await _userRepository.GetByUsernameAsync(dto.Username);
        if (existingUsername != null)
            throw new AuthException("Username already exists.");

        var existingEmail = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingEmail != null)
            throw new AuthException("Email already registered.");

        var user = new User { Username = dto.Username, Email = dto.Email };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto { Token = token, Username = user.Username };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByUsernameAsync(dto.Username);
        if (user == null) return null;

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed) return null;

        var token = _tokenService.GenerateToken(user);
        return new AuthResponseDto { Token = token, Username = user.Username };
    }
}