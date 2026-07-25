import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryDto } from '../../../core/services/category.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent],
  templateUrl: './category-manager.component.html',
  styleUrl: './category-manager.component.scss'
})
export class CategoryManagerComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  categories: CategoryDto[] = [];
  newCategoryName = '';
  changesMade = false;
  errorMessage = '';

  showDeleteConfirm = false;
  categoryToDelete: number | null = null;

  constructor(private categoryService: CategoryService) { }

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

    this.categoryService.create({ name: this.newCategoryName.trim() }).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.changesMade = true;
        this.loadCategories();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Something went wrong.';
      }
    });
  }

  close(): void {
    this.closed.emit(this.changesMade);
  }

  requestDeleteCategory(id: number): void {
    this.categoryToDelete = id;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(confirmed: boolean): void {
    this.showDeleteConfirm = false;
    if (confirmed && this.categoryToDelete) {
      this.categoryService.delete(this.categoryToDelete).subscribe(() => {
        this.changesMade = true;
        this.loadCategories();
      });
    }
    this.categoryToDelete = null;
  }
}