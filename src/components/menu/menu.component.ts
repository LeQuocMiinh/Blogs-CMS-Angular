import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { AppStorage } from 'src/libs/storage';
import { MenuService } from './menu.service';
import { LoginService } from 'src/app/auth/login/login.service';
import { Loading } from 'src/libs/loading';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MenuService]
})
export class MenuComponent implements OnInit, OnDestroy {
  event$: any;
  storage: AppStorage = new AppStorage();
  user: any;
  @Output() toggleMenu = new EventEmitter<boolean>(false);
  toggleMenuDefault: boolean = false;
  currentRoute: string = 'dashboard';
  loading: Loading = new Loading();
  constructor(
    private router: Router,
    public menuService: MenuService,
    public loginService: LoginService
  ) {
    this.getCurrentRoute();
  }

  ngOnInit() {
    this.getInfoUser();
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  /**
   * Lấy thông tin người dùng
   */
  getInfoUser() {
    this.user = JSON.parse(this.storage.getItem('user'));
  }

  /**
   * Đóng/Mở menu
   */
  onToggleMenu() {
    this.toggleMenuDefault = !this.toggleMenuDefault;
    this.toggleMenu.emit(this.toggleMenuDefault);
  }


  /**
   * Chuyển hướng đến trang tùy chọn
   * @param redirect 
   */
  navigator(redirect: string) {
    this.router.navigate([redirect]);

  }

  /**
   * Lấy tên đường dẫn hiện tại
   */
  getCurrentRoute() {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        const base = event.url;
        this.currentRoute = base.replace("/", "");
      }
    });
  }


  async logout() {
    this.loading.setLoading(true);
    this.menuService.logout([]).subscribe(res => {
      if (res.status) {
        this.storage.clear();
        this.router.navigate(['/login']);
        this.loginService.onLogged(false);
      }
      this.loading.setLoading(false);
    });
  }
}
