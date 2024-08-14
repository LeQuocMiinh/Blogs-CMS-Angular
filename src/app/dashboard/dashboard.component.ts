import { Component } from '@angular/core';
import { AppStorage } from 'src/libs/storage';
import { LoginService } from '../auth/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Blogs-CMS-Angular';
  logged: boolean = false;
  storage: AppStorage = new AppStorage();

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    const user = this.storage.getItem('user');
    if (user) { this.loginService.onLogged(true); } else {
      this.router.navigate(['/login']);
    }
  }
}
