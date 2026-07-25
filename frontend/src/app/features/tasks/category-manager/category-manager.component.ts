import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryDto } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  categories: CategoryDto[] = [];
  newCategoryName = '';
  changesMade = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;

    this.categoryService.create({ name: this.newCategoryName.trim() }).subscribe(() => {
      this.newCategoryName = '';
      this.changesMade = true;
      this.loadCategories();
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category? Tasks in it will become uncategorized.')) return;

    this.categoryService.delete(id).subscribe(() => {
      this.changesMade = true;
      this.loadCategories();
    });
  }

  close(): void {
    this.closed.emit(this.changesMade);
  }
}