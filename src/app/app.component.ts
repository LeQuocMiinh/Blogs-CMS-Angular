import { Component, OnInit } from '@angular/core';
import { LoginService } from './auth/login/login.service';
import { AppStorage } from 'src/libs/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Blogs-CMS-Angular';
  logged: boolean = false;
  storage: AppStorage = new AppStorage();
  toggleMenu: boolean = false;
  styleDefault: string = "padding: 12px 12px 12px 285px;";

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.receivedLogged()
  }

  ngOnInit(): void {
    this.receivedLogged();
    this.fetchUser();
  }

  async fetchUser() {
    const user = this.storage.getItem('user');
    this.logged = user ? true : false;
    if (!this.logged) {
      this.router.navigate(['/login']);
    }
  }

  receivedLogged() {
    this.loginService.currentData.subscribe(res => {
      this.logged = res;
    });
  }

  async receivedToggleMenu(data: any) {
    this.toggleMenu = data;
  }

}