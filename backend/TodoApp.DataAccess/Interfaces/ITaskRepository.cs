using TodoApp.Domain.Entities;

namespace TodoApp.DataAccess.Interfaces;

public interface ITaskRepository : IGenericRepository<TaskItem>
{
    Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedAsync(
        int userId,
        int pageNumber,
        int pageSize,
        string? searchTerm,
        int? categoryId);
}