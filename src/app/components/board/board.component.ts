import { Component, OnDestroy, OnInit, Self } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, Observable, takeUntil, throwError } from 'rxjs';
import { LoadingService } from '../../service/loading.service';
import { WebSocketService } from '../../service/web-socket.service';
import { ColumnService } from '../../service/column.service';
import { Column } from '../../model/column';
import { Task } from '../../model/task';
import { AuthService } from '../../service/auth.service';
import { UpdateService } from '../../service/update.service';
import { SnotifyService } from 'ng-snotify';
import { NgOnDestroy } from '../../service/ngOnDestroy';
import { TaskService } from '../../service/task.service';
import { Board } from '../../model/board';
import { BoardService } from '../../service/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [NgOnDestroy]
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId!: string;
  data$!: Observable<{
    userId: string | undefined;
    board: Board;
    columns: Column[];
    tasks: Task[];
  }>;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private webSocketAPIService: WebSocketService,
    private columnService: ColumnService,
    private authService: AuthService,
    private updateService: UpdateService,
    private notifier: SnotifyService,
    private taskService: TaskService,
    private boardService: BoardService,
    private router: Router,
    @Self() private onDestroy: NgOnDestroy
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error(`Can't get boardId from url`);
    }
    this.boardId = boardId;
  }

  ngOnInit(): void {
    this.fetch();
    this.updateService.fetch$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.fetch());
    this.webSocketAPIService.connect();
  }

  fetch() {
    const currentUserId$ = this.authService.user$
      .pipe(
        map(user => user?.id)
      );

    const board$ = this.boardService.getBoard(this.boardId)
      .pipe(
        catchError(err => {
          this.notifier.error(`Error: can't load board!`);
          return throwError(err);
        })
      );
    const loadBoard$ = this.loadingService.showLoaderUntilCompleted(board$);

    const columns$ = this.columnService.getAllByBoardId(this.boardId)
      .pipe(
        catchError(err => {
          this.notifier.error(`Error: can't load columns!`);
          return throwError(err);
        })
      );
    const loadColumns$ = this.loadingService.showLoaderUntilCompleted(columns$);

    const tasks$ = this.taskService.getAllByBoardId(this.boardId)
      .pipe(
        catchError(err => {
          this.notifier.error(`Error: can't load tasks!`);
          return throwError(err);
        })
      );
    const loadTasks$ = this.loadingService.showLoaderUntilCompleted(tasks$);

    this.data$ = combineLatest([currentUserId$, loadBoard$, loadColumns$, loadTasks$])
      .pipe(
        map(([userId, board, columns, tasks]) => ({userId, board, columns, tasks}))
      );
  }

  getTasksByColumnId(columnId: string | undefined, tasks: Task[]): Task[] {
    return tasks.filter(task => task.columnId === columnId);
  }

  ngOnDestroy(): void {
    this.webSocketAPIService.disconnect();
  }

  createColumn(title: string, userId: string | undefined) {
    this.columnService.create({
      title,
      boardId: this.boardId,
      userId
    });
  }

  createTask(title: string, columnId: string | undefined, userId: string | undefined) {
    this.taskService.create({
      title,
      userId,
      boardId: this.boardId,
      columnId
    });
  }

  updateBoardName(title: string, board: Board) {
    board.title = title;
    this.boardService.update(board);
  }

  deleteBoard() {
    if (confirm('Are you sure you want to delete the board?')) {
      this.boardService.delete(this.boardId);
    }
  }

  deleteColumn(columnId: string | undefined) {
    this.columnService.delete(columnId);
  }

  updateColumn(title: string, column: Column) {
    column.title = title;
    this.columnService.update(column);
  }

  openTask(taskId: string | undefined) {
    this.router.navigate(['boards', this.boardId, 'tasks', taskId]);
  }
}
