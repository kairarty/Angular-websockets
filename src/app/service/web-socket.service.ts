import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Column } from '../model/column';
import { UpdateService } from './update.service';
import { Task } from '../model/task';
import { Board } from '../model/board';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly webSocketEndPoint = 'http://localhost:8080/ws';
  private readonly updateBoardUrl = '/app/update-board';
  private readonly deleteBoardUrl = '/app/delete-board';
  private readonly createColumnUrl = '/app/create-column';
  private readonly updateColumnUrl = '/app/update-column';
  private readonly deleteColumnUrl = '/app/delete-column';
  private readonly createTaskUrl = '/app/create-task';
  private readonly updateTaskUrl = '/app/update-task';
  private readonly deleteTaskUrl = '/app/delete-task';

  private readonly successUpdateBoardUrl = '/topic/update-board';
  private readonly successDeleteBoardUrl = '/topic/delete-board';
  private readonly successCreateColumnUrl = '/topic/create-column';
  private readonly successUpdateColumnUrl = '/topic/update-column';
  private readonly successDeleteColumnUrl = '/topic/delete-column';
  private readonly successCreateTaskUrl = '/topic/create-task';
  private readonly successUpdateTaskUrl = '/topic/update-task';
  private readonly successDeleteTaskUrl = '/topic/delete-task';
  private stompClient: any;
  private token!: string | null;

  constructor(
    private updateService: UpdateService,
    private router: Router
  ) {
  }

  connect() {
    this.token = localStorage.getItem('token');
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({'Authorization': this.token}, () => {
      this.stompClient.subscribe(this.successUpdateBoardUrl, (sdkEvent: Task) => this.onBoardUpdated(sdkEvent));
      this.stompClient.subscribe(this.successDeleteBoardUrl, (sdkEvent: string) => this.onBoardDeleted(sdkEvent));
      this.stompClient.subscribe(this.successCreateColumnUrl, (sdkEvent: Column) => this.onColumnCreated(sdkEvent));
      this.stompClient.subscribe(this.successUpdateColumnUrl, (sdkEvent: Column) => this.onColumnUpdated(sdkEvent));
      this.stompClient.subscribe(this.successDeleteColumnUrl, (sdkEvent: string) => this.onColumnDeleted(sdkEvent));
      this.stompClient.subscribe(this.successCreateTaskUrl, (sdkEvent: Task) => this.onTaskCreated(sdkEvent));
      this.stompClient.subscribe(this.successUpdateTaskUrl, (sdkEvent: Task) => this.onTaskUpdated(sdkEvent));
      this.stompClient.subscribe(this.successDeleteTaskUrl, (sdkEvent: string) => this.onTaskDeleted(sdkEvent));
    }, this.errorCallBack);
  };

  updateBoard(board: Board) {
    this.stompClient.send(this.updateBoardUrl, {'Authorization': this.token}, JSON.stringify(board));
  }

  deleteBoard(boardId: string) {
    this.stompClient.send(this.deleteBoardUrl + `/${boardId}`, {'Authorization': this.token});
  }

  createColumn(column: Column) {
    this.stompClient.send(this.createColumnUrl, {'Authorization': this.token}, JSON.stringify(column));
  }

  updateColumn(column: Column) {
    this.stompClient.send(this.updateColumnUrl, {'Authorization': this.token}, JSON.stringify(column));
  }

  deleteColumn(columnId: string | undefined) {
    this.stompClient.send(this.deleteColumnUrl + `/${columnId}`, {'Authorization': this.token});
  }

  createTask(task: Task) {
    this.stompClient.send(this.createTaskUrl, {'Authorization': this.token}, JSON.stringify(task));
  }

  updateTask(task: Task) {
    this.stompClient.send(this.updateTaskUrl, {'Authorization': this.token}, JSON.stringify(task));
  }

  deleteTask(taskId: string) {
    this.stompClient.send(this.deleteTaskUrl + `/${taskId}`, {'Authorization': this.token});
  }

  onBoardUpdated(newTask: Task) {
    console.log('A board has been updated' + newTask);
    this.updateService.update();
  }

  onBoardDeleted(boardId: string) {
    console.log('A board has been deleted: ' + boardId);
    this.router.navigateByUrl('/boards');
  }

  onColumnCreated(newColumn: Column) {
    console.log('New column has been created' + newColumn);
    this.updateService.update();
  }

  onColumnUpdated(column: Column) {
    console.log('The column has been updated' + column);
    this.updateService.update();
  }

  onColumnDeleted(columnId: string) {
    console.log('A column has been deleted: ' + columnId);
    this.updateService.update();
  }

  onTaskCreated(newTask: Task) {
    console.log('New task has been created' + newTask);
    this.updateService.update();
  }

  onTaskUpdated(task: Task) {
    console.log('The task has been updated' + task);
    this.updateService.update();
  }

  onTaskDeleted(taskId: string) {
    console.log('The task has been deleted: ' + taskId);
    this.updateService.update();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log('Disconnected');
    }
  }

  errorCallBack(error: any) {
    console.log('errorCallBack -> ' + error);
  }
}
