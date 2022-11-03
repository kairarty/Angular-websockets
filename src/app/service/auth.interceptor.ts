import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   // при каждом запросе подставляется токен
    const token = localStorage.getItem('token');
    request = request.clone({
      setHeaders: {
        Authorization: token ?? ''
      }
    });
    return next.handle(request);
  }
}
