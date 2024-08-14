import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { AppStorage } from 'src/libs/storage';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  value: string = '';
  storage: AppStorage = new AppStorage();

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router
  ) {
    this.initForm();
  }

  async ngOnInit() {
    await this.autoLogin();
  }

  /**
   * Khởi tạo form
   */
  initForm() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  /**
   * Login
   */
  async login() {
    this.setLoading(true);
    const data = this.form.value;
    await this.loginService.login(data).then(async res => {
      this.storage.setItem('access_token', res.accessToken);
      this.loginService.fetchUser().subscribe(res => {
        this.storage.setItem('user', JSON.stringify(res.data));
      });
      this.loginService.onLogged(true);
      this.navigate('/dashboard');
      this.setLoading(false);
    }).catch(error => {
      throw error;
    });
  }

  /**
   * Tự động login
   */
  async autoLogin() {
    this.setLoading(true);
    const access_token = this.storage.getItem('access_token');
    if (access_token) {
      await this.loginService.fetchUser().pipe(
        catchError(error => {
          //Xử lý lỗi ở đây
          return of(null);
        })
      ).subscribe(res => {
        this.loginService.onLogged(true);
        this.storage.setItem('user', JSON.stringify(res.data));
        this.navigate('/dashboard');
      });
    }
    this.setLoading(false);
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  setLoading(value: boolean) {
    const loadingHtml = document.getElementById('loading');
    if (loadingHtml) {
      loadingHtml.style.display = (value) ? 'flex' : 'none';
    }
  }
}
