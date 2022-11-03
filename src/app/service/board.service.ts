import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../model/board';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly boardsUrl = environment.apiUrl + '/boards';
  private readonly createBoardsUrl = this.boardsUrl + '/create';

  constructor(
    private http: HttpClient,
    private websocketService: WebSocketService
  ) {
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.boardsUrl);
  }

  getBoard(boardId: string): Observable<Board> {
    return this.http.get<Board>(this.boardsUrl + `/${boardId}`);
  }

  createBoard(title: string): Observable<Board> {
    return this.http.post<Board>(this.createBoardsUrl, title);
  }

  update(board: Board) {
    this.websocketService.updateBoard(board);
  }

  delete(boardId: string) {
    this.websocketService.deleteBoard(boardId);
  }
}
