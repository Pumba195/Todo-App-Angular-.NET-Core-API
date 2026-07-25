using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.DataAccess.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Category>> GetByUserIdAsync(int userId)
    {
        return await _dbSet.Where(c => c.UserId == userId).ToListAsync();
    }
}