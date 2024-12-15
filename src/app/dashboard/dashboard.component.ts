import { Component, SimpleChanges } from '@angular/core';
import { AppStorage } from 'src/libs/storage';
import { LoginService } from '../auth/login/login.service';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Blogs-CMS-Angular';
  logged: boolean = false;
  storage: AppStorage = new AppStorage();
  dataPopularPost: any;
  optionsPopularPost: any;
  dataAccessSource: any;
  optionsAccessSource: any;
  idsPostsMostViews: any[] = [];
  isLoading: boolean = false;
  months: any[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  constructor(
    private loginService: LoginService,
    private router: Router,
    public dashboardService: DashboardService
  ) {
  }

  async ngOnInit() {
    this.fetchUser();
    await Promise.all([
      await this.getPostsMostViews(2, 'recent'),
      await this.createPieChartStorageMedia(),
    ]).then(() => { this.isLoading = true });
  }

  /**
   * Lấy các vài viết có lượt xem nhiều nhất
   * @param nums 
   * @param option 
   */
  async getPostsMostViews(nums: number, option: string) {
    const params = {
      nums: nums,
      option: option
    };
    await this.dashboardService.getPostsMostViews(params).then((res: any) => {
      this.idsPostsMostViews = res.data.map((e: any) => { return { id: e._id, title: e.title } });
    });

    await this.getDataViewsByPostId(this.idsPostsMostViews);
  }

  async getDataViewsByPostId(ids: any[]) {
    let data: any[] = [];
    await Promise.all(ids.map(async (item: any) => {
      const params = {
        id: item?.id,
        option: "day"
      };
      data.push(await this.dashboardService.getDataViewsByPostId(params).then((res: any) => {
        if (res.status) {
          return {
            title: item?.title,
            id: res.postId,
            data: res.data,
          }
        }
        return [];
      }));
    }))
    this.createChartPopularPost(data[0], data[1]);
  }

  fetchUser() {
    const user = this.storage.getItem('user');
    if (user) { this.loginService.onLogged(true); } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Tạo biểu đồ bài viết phổ biến 
   * @param post_1 
   * @param post_2 
   */
  createChartPopularPost(post_1: any, post_2: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataPopularPost = {
      labels: this.months,
      datasets: [
        {
          label: post_1.title,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: this.handleDataPopularMost(post_1)
        },
        {
          label: post_2.title,
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: this.handleDataPopularMost(post_2)
        }
      ]
    };

    this.optionsPopularPost = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    };
  }

  /**
   * Xử lý dữ liệu 
   * @param data 
   * @returns 
   */
  handleDataPopularMost(data: any) {
    const source = data.data;
    const monthlyData = Array(12).fill(0);

    source.forEach((item: any) => {
      const date = new Date(item.date);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex] += item.views;
    });
    return this.months.map((month, index) => (
      monthlyData[index] || 0
    ));
  }


  async createPieChartStorageMedia() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const dataBefore = await this.getStorageMedia();
    this.dataAccessSource = {
      labels: ['Đã sử dụng', 'Còn trống'],
      datasets: [
        {
          data: dataBefore,
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.optionsAccessSource = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  async getStorageMedia() {
    return await this.dashboardService.getStorageMedia().then((res: any) => { return res.status ? res.data : [] });
  }
}
