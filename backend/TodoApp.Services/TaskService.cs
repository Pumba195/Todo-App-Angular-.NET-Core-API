using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.DTOs;
using TodoApp.Services.Interfaces;

namespace TodoApp.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<PagedResultDto<TaskDto>> GetPagedTasksAsync(
        int userId, int pageNumber, int pageSize, string? search, int? categoryId)
    {
        var (items, totalCount) = await _taskRepository.GetPagedAsync(
            userId, pageNumber, pageSize, search, categoryId);

        return new PagedResultDto<TaskDto>
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<TaskDto?> GetByIdAsync(int userId, int taskId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);
        if (task == null || task.UserId != userId) return null;
        return MapToDto(task);
    }

    public async Task<TaskDto> CreateAsync(int userId, CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            CategoryId = dto.CategoryId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            IsCompleted = false
        };

        await _taskRepository.AddAsync(task);
        await _taskRepository.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<bool> UpdateAsync(int userId, int taskId, UpdateTaskDto dto)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);
        if (task == null || task.UserId != userId) return false;

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.IsCompleted = dto.IsCompleted;
        task.DueDate = dto.DueDate;
        task.CategoryId = dto.CategoryId;

        _taskRepository.Update(task);
        return await _taskRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int userId, int taskId)
    {
        var task = await _taskRepository.GetByIdAsync(taskId);
        if (task == null || task.UserId != userId) return false;

        _taskRepository.Delete(task);
        return await _taskRepository.SaveChangesAsync();
    }

    private static TaskDto MapToDto(TaskItem task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        IsCompleted = task.IsCompleted,
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        CategoryId = task.CategoryId,
        CategoryName = task.Category?.Name
    };
}