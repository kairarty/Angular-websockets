import { Component, OnInit, Self } from '@angular/core';
import { BoardService } from '../../service/board.service';
import { catchError, Observable, takeUntil, throwError } from 'rxjs';
import { NgOnDestroy } from '../../service/ngOnDestroy';
import { Board } from '../../model/board';
import { LoadingService } from '../../service/loading.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  providers: [NgOnDestroy]
})
export class BoardsComponent implements OnInit {
  boards$!: Observable<Board[]>;

  constructor(
    private boardsService: BoardService,
    private loadingService: LoadingService,
    private notifier: SnotifyService,
    @Self() private onDestroy: NgOnDestroy
  ) {
  }

  ngOnInit(): void {
    this.fetchBoards();
  }

  fetchBoards() {
    const boards$ = this.boardsService.getBoards()
      .pipe(
        catchError(err => {
          this.notifier.error(`Error: can't load boards!`);
          return throwError(err);   // прерывает дальнейшую цепочку
        })
      );
    const loadBoards$ = this.loadingService.showLoaderUntilCompleted(boards$);
    this.boards$ = loadBoards$;
  }

  createBoard(title: string) {
    const boardCreated$ = this.boardsService.createBoard(title)
      .pipe(catchError(err => {
          this.notifier.error(`Error: can't add board!`);
          return throwError(err);
        })
      );
    this.loadingService.showLoaderUntilCompleted(boardCreated$)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.fetchBoards());
  }

}
