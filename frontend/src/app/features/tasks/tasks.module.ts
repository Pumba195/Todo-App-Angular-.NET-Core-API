import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';

@NgModule({
  imports: [
    CommonModule,
    TasksRoutingModule,
    TaskListComponent,
    TaskFormComponent,
    CategoryManagerComponent
  ]
})
export class TasksModule { }