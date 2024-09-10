import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Loading } from 'src/libs/loading';
import { PostService } from './post.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService, MessageService, ConfirmationService, DialogService, DatePipe]
})
export class PostComponent {
  loading: Loading = new Loading();
  form!: FormGroup;
  show: boolean = true;
  columns: any[] = [];
  posts: any[] = [];
  imageSelected: string = '';
  uploadedFiles: any[] = [];
  istrash: boolean = false;
  introduce = {
    icon: 'bi bi-list',
    title: 'Danh sách danh mục'
  };
  isEdit: boolean = false;
  idEdit: number = 0;
  actionsMap: any = {
    trash: (ids: Array<any>) => this.actionTrash(ids),
    restore: (ids: Array<any>) => this.actionRestore(ids),
    delete: (ids: Array<any>) => this.actionDelete(ids),
    edit: (ids: Array<any>, data: any) => this.actionEdit(data)
  };
  ref: DynamicDialogRef | undefined;
  typeChecked: string = 'radio';
  status = [
    { name: "Công khai", value: 'published' },
    { name: "Bản nháp", value: 'draft' },
    { name: "Riêng tư", value: 'privated' }
  ];

  constructor(
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public postService: PostService,
    public fb: FormBuilder,
    public dialogService: DialogService,
    public datePipe: DatePipe,
    public router: Router,
  ) {
    this.initForm();
    this.initColumn();
  }

  async ngOnInit() {
    await this.getAllPosts();
  }


  initForm() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      parent: [null],
      image: [null]
    })
  }

  /**
   * Khởi tạo cột
   */
  async initColumn() {
    this.columns = [
      { title: 'Tên', name: 'title', align: 'center', width: '20rem' },
      { title: 'Mô tả ngắn', name: 'description', align: 'center' },
      {
        title: 'Ngày tạo', name: 'createdAt', align: 'center', width: '15rem', render: ({ createdAt }: any) => {
          if (createdAt) {
            return this.datePipe.transform(createdAt, 'dd/MM/yyyy');
          }
          return '---';
        }
      },
      {
        title: 'Số lượt xem', name: 'views', align: 'center', width: '10rem', render: ({ views }: any) => {
          return views > 0 ? views : '---';
        }
      },
      {
        title: 'Trạng thái', name: 'status', align: 'center', width: '10rem', render: ({ status }: any) => {
          if (status) {
            const value: any = this.status.find(e => { return e.value === status });
            return value.name;
          }
          return '---';
        }
      }
    ];
  }

  /**
   * Lấy tất cả danh mục
   */
  async getAllPosts(trash: boolean = false) {
    this.loading.setLoading(true);
    const res: any = await this.postService.getAllPosts();
    this.posts = res.data.filter((item: any) => trash ? item.deleted : !item.deleted);
    this.loading.setLoading(false);
  }

  /**
   * Nhận dữ liệu và hành động từ table
   * @param data rows
   */
  async receivedActionHandle(data: any) {
    this.actionHandlePosts(data.action, data.rows);
    if (data.action == 'view-trash') {
      this.introduce = {
        icon: 'bi bi-trash2-fill',
        title: 'Thùng rác'
      }
      this.getAllPosts(true);
    } else if (data.action == 'view-list') {
      this.introduce = {
        icon: 'bi bi-list',
        title: 'Danh sách danh mục'
      }
      this.getAllPosts(false);
    }
  }


  /**
   * Sửa, xóa danh mục
   * @param action 
   * @param data 
   */
  async actionHandlePosts(action: string, data: any) {
    this.loading.setLoading(true);
    try {
      const ids = data.map((e: any) => e._id);
      if (this.actionsMap[action]) {
        await this.actionsMap[action](ids, data);
      }
    } catch (error) {
      this.loading.setLoading(false);
    }
    this.loading.setLoading(false);
  }

  /**
   * Sửa
   * @param data 
   */
  async actionEdit(data: any) {
    this.router.navigate(['post/' + data[0]._id])
  }

  /**
   * Khôi phục
   * @param ids 
   */
  async actionRestore(ids: Array<any>) {
    await this.postService.restorePosts(ids).then((res: any) => {
      this.showMessage("success", res.message, { status: true, time: 600 });
    }).catch(error => {
      this.showMessage("error", error.message, { status: true, time: 600 });
    });
  }

  /**
   * Chuyển vào thùng rác
   * @param ids 
   */
  async actionTrash(ids: Array<any>) {
    await this.postService.trashPosts(ids).then((res: any) => {
      this.showMessage("success", res.message, { status: true, time: 600 });
    }).catch(error => {
      this.showMessage("error", error.message, { status: true, time: 600 });
    });

  }

  /**
   * Xóa vĩnh viễn
   * @param ids 
   */
  async actionDelete(ids: Array<any>) {
    this.confirmationService.confirm({
      message: 'Xác nhận xóa vĩnh viễn bài viết này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: async () => {
        await this.postService.deletePosts(ids).then((res: any) => {
          this.showMessage("success", res.message, { status: true, time: 600 });
        }).catch(error => {
          this.showMessage("error", error.message, { status: true, time: 600 });
        });
      },
    });
  }

  /**
   * Hủy hành động sửa
   */
  async cancelEdit() {
    this.isEdit = false;
    this.form.reset();
  }

  /**
   * Hiển thị thông báo 
   * @param severity dạng thông báo
   * @param message nội dung
   * @param reload có reload lại trang hay không ? mặc định false
   */
  showMessage(severity: 'success' | 'error' | 'warning', message: string, reload: { status: boolean, time: number }) {
    const summaryVietnamese = {
      success: "Thành công",
      error: "Lỗi",
      warning: "Cảnh báo"
    };

    this.messageService.add({ severity, summary: summaryVietnamese[severity], detail: message });

    if (reload.status && reload.time > 0) {
      setTimeout(() => window.location.reload(), reload.time);
    }
  }


}
