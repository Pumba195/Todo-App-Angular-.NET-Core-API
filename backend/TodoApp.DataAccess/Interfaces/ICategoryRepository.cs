using TodoApp.Domain.Entities;

namespace TodoApp.DataAccess.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IEnumerable<Category>> GetByUserIdAsync(int userId);
}