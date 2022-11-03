import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)   // при поступлении аргумента
      .pipe(
        tap(() => this.loadingOn()),  // включить спиннер, иначе эту строку было бы негде написать
        concatMap(() => obs$),  // изменить тип возвращаемого объекта
        finalize(() => this.loadingOff())   // выполнить в любом случае
      );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
