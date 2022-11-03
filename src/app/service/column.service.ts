import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column } from '../model/column';
import { environment } from '../../environments/environment';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private readonly boardsUrl = environment.apiUrl + '/boards/';
  private readonly columnsUrl = '/columns';

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
  }

  getAllByBoardId(boardId: string): Observable<Column[]> {
    const url = this.boardsUrl + boardId + this.columnsUrl;
    return this.http.get<Column[]>(url);
  }

  create(column: Column) {
    this.webSocketService.createColumn(column);
  }

  delete(columnId: string | undefined) {
    this.webSocketService.deleteColumn(columnId);
  }

  update(column: Column) {
    this.webSocketService.updateColumn(column);
  }
}
