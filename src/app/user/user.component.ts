import { Component } from '@angular/core';
import { UserService } from './user.service';
import { DatePipe } from '@angular/common';
import { Loading } from 'src/libs/loading';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DatePipe]
})
export class UserComponent {
  usersList: any[] = [];
  columns: any;
  loading: Loading = new Loading();

  constructor(
    public userService: UserService,
    public datePipe: DatePipe
  ) {
    this.initColumn();
  }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList() {
    this.loading.setLoading(true);
    this.userService.getUsersList().pipe(
      catchError(err => {
        this.loading.setLoading(false);
        console.log(err);
        return of(null);
      })
    ).subscribe(res => {
      if (res.status) {
        this.usersList = res.data;
      }
      this.loading.setLoading(false);
    })
  }

  /**
   * Khởi tạo cột
   */
  initColumn() {
    this.columns = [
      { title: 'Tên', name: 'name', align: 'center', width: '20rem' },
      { title: 'Email', name: 'email', align: 'center' },
      {
        title: 'Ngày tạo', name: 'createdAt', align: 'center', width: '15rem', render: ({ createdAt }: any) => {
          if (createdAt) {
            return this.datePipe.transform(createdAt, 'dd/MM/yyyy');
          }
          return '---';
        }
      },
    ];
  }
}
