import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../service/task.service';
import { catchError, combineLatest, map, Observable, throwError } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { LoadingService } from '../../../service/loading.service';
import { Task } from '../../../model/task';
import { ColumnService } from '../../../service/column.service';
import { Column } from '../../../model/column';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @HostBinding('class') class = 'task-modal';   // <app-task class="task-modal">

  boardId: string;
  taskId: string;

  data$!: Observable<{
    task: Task
    columns: Column[]
  }>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private taskService: TaskService,
    private columnService: ColumnService,
    private notifier: SnotifyService
  ) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!boardId) {
      throw new Error(`Can't get boardId from URL`);
    }
    if (!taskId) {
      throw new Error(`Can't get taskId from URL`);
    }

    this.boardId = boardId;
    this.taskId = taskId;
  }

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    const task$ = this.taskService.getById(this.taskId)
      .pipe(
        catchError(err => {
          this.notifier.error(`Error: can't load task!`);
          return throwError(err);
        })
      );
    const loadTask$ = this.loadingService.showLoaderUntilCompleted(task$);

    const columns$ = this.columnService.getAllByBoardId(this.boardId);
    const loadColumns$ = this.loadingService.showLoaderUntilCompleted(columns$);

    this.data$ = combineLatest([loadTask$, loadColumns$])
      .pipe(
        map(([task, columns]) => ({task, columns}))
      );
  }

  goToBoard() {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskTitle(title: string, task: Task) {
    task.title = title;
    this.taskService.updateTask(task);
  }

  updateTaskDescription(description: string, task: Task) {
    task.description = description;
    this.taskService.updateTask(task);
  }

  getSelectedColumn(column: Column[], task: Task) {
    return column.find(column => column.id === task.columnId);
  }

  changeColumn(columnId: string, task: Task) {
    task.columnId = columnId;
    this.taskService.updateTask(task);
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId);
    this.goToBoard();
  }
}
