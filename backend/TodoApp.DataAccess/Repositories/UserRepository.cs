using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.DataAccess.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
    }
}