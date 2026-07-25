using TodoApp.DataAccess.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.DTOs;
using TodoApp.Services.Interfaces;

namespace TodoApp.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync(int userId)
    {
        var categories = await _categoryRepository.GetByUserIdAsync(userId);
        return categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name });
    }

    public async Task<CategoryDto> CreateAsync(int userId, CreateCategoryDto dto)
    {
        var category = new Category { Name = dto.Name, UserId = userId };
        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();
        return new CategoryDto { Id = category.Id, Name = category.Name };
    }

    public async Task<bool> DeleteAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null || category.UserId != userId) return false;

        _categoryRepository.Delete(category);
        return await _categoryRepository.SaveChangesAsync();
    }
}