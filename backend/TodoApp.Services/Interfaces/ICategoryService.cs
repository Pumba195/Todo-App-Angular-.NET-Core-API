using TodoApp.DTOs;

namespace TodoApp.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync(int userId);
    Task<CategoryDto> CreateAsync(int userId, CreateCategoryDto dto);
    Task<bool> DeleteAsync(int userId, int categoryId);
}