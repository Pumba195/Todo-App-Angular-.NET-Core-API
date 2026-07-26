import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskDto } from '../../../core/services/task.service';
import { CategoryService, CategoryDto } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';
import { debounceTime, Subject } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent, CategoryManagerComponent, ConfirmDialogComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: TaskDto[] = [];
  categories: CategoryDto[] = [];

  pageNumber = 1;
  pageSize = 5;
  totalPages = 0;
  totalCount = 0;

  searchTerm = '';
  selectedCategoryId: number | null = null;

  showTaskForm = false;
  showCategoryManager = false;
  editingTask: TaskDto | null = null;

  showDeleteConfirm = false;
  taskToDelete: number | null = null;

  private searchSubject = new Subject<string>();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.pageNumber = 1;
      this.loadTasks();
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService
      .getPaged(this.pageNumber, this.pageSize, this.searchTerm || undefined, this.selectedCategoryId ?? undefined)
      .subscribe(result => {
        this.tasks = result.items;
        this.totalPages = result.totalPages;
        this.totalCount = result.totalCount;
      });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  onCategoryFilterChange(): void {
    this.pageNumber = 1;
    this.loadTasks();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadTasks();
  }

  toggleComplete(task: TaskDto): void {
    this.taskService.update(task.id, {
      title: task.title,
      description: task.description,
      isCompleted: !task.isCompleted,
      dueDate: task.dueDate,
      categoryId: task.categoryId
    }).subscribe(() => this.loadTasks());
  }

  openCreateForm(): void {
    this.editingTask = null;
    this.showTaskForm = true;
  }

  openEditForm(task: TaskDto): void {
    this.editingTask = task;
    this.showTaskForm = true;
  }

  onFormClosed(refresh: boolean): void {
    this.showTaskForm = false;
    this.editingTask = null;
    if (refresh) this.loadTasks();
  }

  onCategoryManagerClosed(refresh: boolean): void {
    this.showCategoryManager = false;
    if (refresh) {
      this.loadCategories();
      this.loadTasks();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  requestDeleteTask(id: number): void {
    this.taskToDelete = id;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(confirmed: boolean): void {
    this.showDeleteConfirm = false;
    if (confirmed && this.taskToDelete) {
      this.taskService.delete(this.taskToDelete).subscribe(() => this.loadTasks());
    }
    this.taskToDelete = null;
  }

  trackByTaskId(index: number, task: TaskDto): number {
    return task.id;
  }
}