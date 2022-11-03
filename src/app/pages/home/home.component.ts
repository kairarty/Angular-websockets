import { Component, OnInit, Self } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NgOnDestroy } from '../../service/ngOnDestroy';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgOnDestroy]
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Self() private onDestroy: NgOnDestroy
  ) {
  }

  ngOnInit(): void {
    if (this.authService.checkLogin()) {
      this.router.navigateByUrl('/boards');
    }
  }

}
