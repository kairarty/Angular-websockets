import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
