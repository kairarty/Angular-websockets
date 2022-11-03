import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly boardsUrl = environment.apiUrl + '/boards/';
  private readonly tasksUrl = '/tasks';

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
  }

  getAllByBoardId(boardId: string): Observable<Task[]> {
    const url = this.boardsUrl + boardId + this.tasksUrl;
    return this.http.get<Task[]>(url);
  }

  getById(taskId: string): Observable<Task> {
    const url = environment.apiUrl + this.tasksUrl + `/${taskId}`;
    return this.http.get<Task>(url);
  }

  create(task: Task) {
    this.webSocketService.createTask(task);
  }

  updateTask(task: Task) {
    this.webSocketService.updateTask(task);
  }

  deleteTask(taskId: string) {
    this.webSocketService.deleteTask(taskId);
  }
}
