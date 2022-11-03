import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../model/loginRequest';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userUrl = environment.apiUrl + '/user/current';
  private readonly registerUrl = environment.apiUrl + '/auth/register';
  private readonly loginUrl = environment.apiUrl + '/auth/login';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
  }

  register(request: User): Observable<User> {
    return this.http.post<User>(this.registerUrl, request)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
        })
      );
  }

  login(request: LoginRequest): Observable<User> {
    return this.http.post<User>(this.loginUrl, request)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.userUrl)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
        }),
        catchError((err) => {
          this.userSubject.next(null);
          return throwError(err);
        })
      );
  }


  logout() {
    this.userSubject.next(null);
    this.webSocketService.disconnect();
    localStorage.removeItem('token');
  }

  checkLogin(): boolean {
    return !!localStorage.getItem('token');
  }
}
