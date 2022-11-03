import { Component, Self } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { takeUntil } from 'rxjs';
import { NgOnDestroy } from '../../../service/ngOnDestroy';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgOnDestroy]
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifier: SnotifyService,
    private router: Router,
    @Self() private onDestroy: NgOnDestroy
  ) {
  }

  onSubmit(): void {
    this.authService.login(this.form.value)
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (currentUser) => {
          localStorage.setItem('token', currentUser.token);
          console.log('set token');
          this.router.navigateByUrl('/boards');
        },
        error: (err: HttpErrorResponse) => this.notifier.error(err.error)
      });
  }

}
