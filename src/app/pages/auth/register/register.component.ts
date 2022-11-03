import { Component, Self } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { NgOnDestroy } from '../../../service/ngOnDestroy';
import { takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [NgOnDestroy]
})
export class RegisterComponent {
  form = this.fb.group({
    email: ['', Validators.required],
    userName: ['', Validators.required],
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
    this.authService.register(this.form.value)
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (currentUser) => {
          localStorage.setItem('token', currentUser.token);
          this.router.navigateByUrl('/boards');
        },
        error: (err: HttpErrorResponse) => this.notifier.error(err.error)
      });
  }
}
