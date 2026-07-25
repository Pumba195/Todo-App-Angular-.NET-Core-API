import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService, TaskDto } from '../../../core/services/task.service';
import { CategoryDto } from '../../../core/services/category.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  @Input() task: TaskDto | null = null;
  @Input() categories: CategoryDto[] = [];
  @Output() closed = new EventEmitter<boolean>();

  form: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      categoryId: [null],
      isCompleted: [false]
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate ? this.task.dueDate.substring(0, 10) : '',
        categoryId: this.task.categoryId ?? null,
        isCompleted: this.task.isCompleted
      });
    }
  }

  get isEditMode(): boolean {
    return !!this.task;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    const value = this.form.value;
    const dueDate = value.dueDate ? new Date(value.dueDate).toISOString() : undefined;

    if (this.isEditMode && this.task) {
      this.taskService.update(this.task.id, {
        title: value.title,
        description: value.description,
        isCompleted: value.isCompleted,
        dueDate,
        categoryId: value.categoryId ?? undefined
      }).subscribe(() => this.closed.emit(true));
    } else {
      this.taskService.create({
        title: value.title,
        description: value.description,
        dueDate,
        categoryId: value.categoryId ?? undefined
      }).subscribe(() => this.closed.emit(true));
    }
  }

  onCancel(): void {
    this.closed.emit(false);
  }
}