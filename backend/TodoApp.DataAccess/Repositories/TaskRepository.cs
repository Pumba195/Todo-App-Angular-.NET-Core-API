using Microsoft.EntityFrameworkCore;
using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.DataAccess.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(AppDbContext context) : base(context) { }

    public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
        int userId,
        int pageNumber,
        int pageSize,
        string? searchTerm,
        int? categoryId)
    {
        var query = _dbSet
            .Include(t => t.Category)
            .Where(t => t.UserId == userId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(t => t.Title.Contains(searchTerm));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(t => t.CategoryId == categoryId.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}