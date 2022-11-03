import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UpdateService {
  private fetchSubject = new Subject<boolean>();
  fetch$ = this.fetchSubject.asObservable();

  update() {
    this.fetchSubject.next(true);
  }

}
