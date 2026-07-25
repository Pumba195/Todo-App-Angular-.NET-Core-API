using TodoApp.DTOs;

namespace TodoApp.Services.Interfaces;

public interface ITaskService
{
    Task<PagedResultDto<TaskDto>> GetPagedTasksAsync(
        int userId, int pageNumber, int pageSize, string? search, int? categoryId);
    Task<TaskDto?> GetByIdAsync(int userId, int taskId);
    Task<TaskDto> CreateAsync(int userId, CreateTaskDto dto);
    Task<bool> UpdateAsync(int userId, int taskId, UpdateTaskDto dto);
    Task<bool> DeleteAsync(int userId, int taskId);
}