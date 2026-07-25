using TodoApp.Domain.Entities;

namespace TodoApp.Services.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}