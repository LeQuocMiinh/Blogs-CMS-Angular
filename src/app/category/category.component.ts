import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from './category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading } from 'src/libs/loading';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalMediaComponent } from 'src/components/modal-media/modal-media.component';
import { ParamCreateCategory } from './category.model';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [CategoryService, DialogService]
})
export class CategoryComponent {
  loading: Loading = new Loading();
  form!: FormGroup;
  show: boolean = true;
  columns: any[] = [];
  categories: any[] = [];
  categoriesOptionSelect: any[] = [];
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

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.initForm();
    this.initColumn();
  }

  async ngOnInit() {
    await this.getAllCategories();
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
      {
        title: 'Danh mục cha', name: 'parent', align: 'center', render: ({ parent }: any) => {
          if (parent) {
            return !parent.deleted ? parent.title : '---';
          }
          return '---';
        }
      }
    ];
  }

  /**
   * Lấy tất cả danh mục
   */
  async getAllCategories(trash: boolean = false) {
    this.loading.setLoading(true);
    const res: any = await this.categoryService.getAllCategories([]);
    const originData = res.data.filter((item: any) => !item.deleted);
    this.categories = res.data.filter((item: any) => trash ? item.deleted : !item.deleted);
    this.categoriesOptionSelect = originData.map((item: any) => {
      return {
        name: item.title,
        id: item._id,
      }
    });
    this.loading.setLoading(false);
  }

  /**
   * Lấy chi tiết của 1 danh mục
   * @param id 
   * @returns 
   */
  async getDetailCategory(id: any) {
    this.loading.setLoading(true);
    const res = await this.categoryService.getDetailCategory(id);
    this.loading.setLoading(false);
    return res;
  }

  /**
   * Nhận dữ liệu và hành động từ table
   * @param data rows
   */
  async receivedActionHandle(data: any) {
    this.actionHandleCategories(data.action, data.rows);
    if (data.action == 'view-trash') {
      this.introduce = {
        icon: 'bi bi-trash2-fill',
        title: 'Thùng rác'
      }
      this.getAllCategories(true);
    } else if (data.action == 'view-list') {
      this.introduce = {
        icon: 'bi bi-list',
        title: 'Danh sách danh mục'
      }
      this.getAllCategories(false);
    }
  }

  /**
   * Lưu
   */
  async submit() {
    this.loading.setLoading(true);
    const formData: ParamCreateCategory = {
      title: this.form.value.title,
      description: this.form.value.description,
      parent: this.form.value.parent?.id || null,
      image: this.form.value.image || null
    }
    try {
      let res;
      if (this.isEdit) {
        res = await this.categoryService.updateCategory(this.idEdit, formData);
      } else {
        res = await this.categoryService.createCategory(formData);
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
  async actionHandleCategories(action: string, data: any) {
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
    if (row.image) {
      this.imageSelected = row.image;
    }
    this.form.patchValue(row);
    this.idEdit = row._id;
    if (row.parent) {
      const objParent = row.parent.deleted ? null : {
        id: row.parent?._id,
        name: row.parent?.title,
      };

      this.form.get('parent')?.setValue(objParent);
    }
  }

  /**
   * Khôi phục
   * @param ids 
   */
  async actionRestore(ids: Array<any>) {
    await this.categoryService.restoreCategories(ids).then(res => {
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
    await this.categoryService.trashCategories(ids).then(res => {
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
      message: 'Xác nhận xóa vĩnh viễn danh mục này?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: async () => {
        await this.categoryService.deleteCategories(ids).then(res => {
          this.showMessage("success", res.message, { status: true, time: 600 });
        }).catch(error => {
          this.showMessage("error", error.message, { status: true, time: 600 });
        });
      },
    });
  }

  /**
   * Xóa ảnh
   */
  async removeImage() {
    this.imageSelected = '';
    this.form.get('image')?.setValue(this.imageSelected);
  }

  /**
   * Hủy hành động sửa
   */
  async cancelEdit() {
    this.isEdit = false;
    this.form.reset();
    this.removeImage();
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

  /**
   * Mở modal hình ảnh 
   */
  async openModalMedia() {
    this.ref = this.dialogService.open(ModalMediaComponent, {
      header: 'Hình ảnh',
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      data: {
        typeChecked: this.typeChecked
      }
    });

    this.ref.onClose.subscribe(res => {
      if (res) {
        this.imageSelected = res.secure_url;
        this.form.get('image')?.setValue(this.imageSelected);
      }
    })
  }

}
