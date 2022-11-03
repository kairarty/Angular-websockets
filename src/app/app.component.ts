import { Component, OnInit, Self } from '@angular/core';
import { AuthService } from './service/auth.service';
import { NgOnDestroy } from './service/ngOnDestroy';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgOnDestroy]
})
export class AppComponent implements OnInit {
  name!: string;

  constructor(
    private authService: AuthService,
    @Self() private onDestroy: NgOnDestroy
  ) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(currentUser => {
          console.log('set user');
        }
      );
  }
}
