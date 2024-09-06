import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalMediaComponent } from 'src/components/modal-media/modal-media.component';
import { Loading } from 'src/libs/loading';
import { TagService } from './tag.service';
import { ParamCreateTag } from './tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [DialogService, TagService]
})
export class TagComponent {
  loading: Loading = new Loading();
  form!: FormGroup;
  show: boolean = true;
  columns: any[] = [];
  tags: any[] = [];
  tagsOptionSelect: any[] = [];
  istrash: boolean = false;
  introduce = {
    icon: 'bi bi-list',
    title: 'Danh sách thẻ'
  };
  isEdit: boolean = false;
  idEdit: number = 0;
  actionsMap: any = {
    trash: (ids: Array<any>) => this.actionTrash(ids),
    restore: (ids: Array<any>) => this.actionRestore(ids),
    delete: (ids: Array<any>) => this.actionDelete(ids),
    edit: (ids: Array<any>, data: any) => this.actionEdit(data)
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tagService: TagService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.initForm();
    this.initColumn();
  }

  async ngOnInit() {
    await this.getAllTags();
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
      { title: 'Tên', name: 'title', align: 'center' },
      { title: 'Mô tả', name: 'description', align: 'center', width: '20rem' },
    ];
  }

  /**
   * Lấy tất cả thẻ
   */
  async getAllTags(trash: boolean = false) {
    this.loading.setLoading(true);
    const res: any = await this.tagService.getAllTags();
    this.tags = res.data.filter((item: any) => trash ? item.deleted : !item.deleted);
    this.loading.setLoading(false);
  }

  /**
   * Nhận dữ liệu và hành động từ table
   * @param data rows
   */
  async receivedActionHandle(data: any) {
    this.actionHandleTags(data.action, data.rows);
    if (data.action == 'view-trash') {
      this.introduce = {
        icon: 'bi bi-trash2-fill',
        title: 'Thùng rác'
      }
      this.getAllTags(true);
    } else if (data.action == 'view-list') {
      this.introduce = {
        icon: 'bi bi-list',
        title: 'Danh sách thẻ'
      }
      this.getAllTags(false);
    }
  }

  /**
   * Lưu
   */
  async submit() {
    this.loading.setLoading(true);
    const formData = this.form.value;
    try {
      let res;
      if (this.isEdit) {
        res = await this.tagService.updateTag(this.idEdit, formData);
      } else {
        res = await this.tagService.createTag(formData);
      }
      this.showMessage("success", res.message, { status: true, time: 600 });
    } catch (error: any) {
      this.showMessage("error", error.message, { status: true, time: 600 });
    } finally {
      this.loading.setLoading(false);
    }
  }


  /**
   * Sửa, xóa danh mục
   * @param action 
   * @param data 
   */
  async actionHandleTags(action: string, data: any) {
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
    const row = data[0];
    this.isEdit = true;
    this.form.patchValue(row);
    this.idEdit = row._id;
  }

  /**
   * Khôi phục
   * @param ids 
   */
  async actionRestore(ids: Array<any>) {
    await this.tagService.restoreTags(ids).then(res => {
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
    await this.tagService.trashTags(ids).then(res => {
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
      message: 'Xác nhận xóa vĩnh viễn thẻ này?  ',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: async () => {
        await this.tagService.deleteTags(ids).then(res => {
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
