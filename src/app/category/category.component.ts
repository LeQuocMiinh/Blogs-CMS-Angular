import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoryService } from './category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [CategoryService]
})
export class CategoryComponent {
  form!: FormGroup;
  show: boolean = true;
  selectedCategory: any;
  actionHandle: any;
  columns: any[] = [];
  categories: any[] = [];
  categoriesOption: any[] = [];
  imageFile: any;
  istrash: boolean = false;
  introduce = {
    icon: 'bi bi-list',
    title: 'Danh sách danh mục'
  };
  isLoader: boolean = false;
  visible: boolean = false;

  constructor(
    private messageService: MessageService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.initColumn();
    this.initForm();
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
          return parent ? parent.title : '---';
        }
      }
    ];
  }

  /**
   * Sự kiện mở file upload hình ảnh
   * @param event 
   * @param callback 
   */
  choose(event: any, callback: any) {
    callback();
  }

  /**
   * Sự kiện upload hình ảnh
   * @param event 
   */
  onFileSelect(event: any) {
    this.imageFile = event.currentFiles[0];
  }

  /**
   * Lấy tất cả danh mục
   */
  async getAllCategories(trash: boolean = false) {
    //this.isLoader = false;
    this.setLoading(true);
    const res: any = await this.categoryService.getAllCategories();
    const originData = res.data.filter((item: any) => !item.deleted);
    this.categories = res.data.filter((item: any) => trash ? item.deleted : !item.deleted);
    this.categoriesOption = originData.map((item: any) => {
      return {
        name: item.title,
        id: item._id,
      }
    });
    //this.isLoader = true;
    this.setLoading(false);
  }

  /**
   * Lấy chi tiết của 1 danh mục
   * @param id 
   * @returns 
   */
  async getDetailCategory(id: any) {
    this.setLoading(true);
    const res = await this.categoryService.getDetailCategory(id);
    this.setLoading(false);
    return res;
  }

  /**
   * Nhận dữ liệu và hành động từ table
   * @param data rows
   */
  async receivedActionHandle(data: any) {
    this.actionHandle = data;
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
   * Bật/tắt hiệu ứng loading
   * @param value 
   */
  setLoading(value: boolean) {
    const loadingHtml = document.getElementById('loading');
    if (loadingHtml) {
      loadingHtml.style.display = (value) ? 'flex' : 'none';
    }
  }

  /**
   * Lưu
   */
  async submit() {
    this.setLoading(true);
    // Tạo đối tượng FormData
    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('description', this.form.value.description);
    if (this.form.value.parent?.id) {
      formData.append('parent', this.form.value.parent?.id);
    }
    // Chỉ thêm tệp hình ảnh nếu nó tồn tại
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    try {
      await this.categoryService.createCategory(formData);
      window.location.reload();
    } catch (error) {
      this.setLoading(false);
    }
    this.setLoading(false);
  }

  /**
   * Sửa, xóa danh mục
   * @param action 
   * @param data 
   */
  async actionHandleCategories(action: string, data: any) {
    this.setLoading(true);
    try {
      const ids = data.map((e: any) => e._id);
      if (action == 'trash') {
        const res = await this.categoryService.trashCategories(ids);
        window.location.reload();
      } else if (action == 'restore') {
        await this.categoryService.restoreCategories(ids);
        window.location.reload();
      } else if (action == 'delete') {
        await this.categoryService.deleteCategories(ids);
        window.location.reload();
      } else if (action == 'edit') {
        this.visible = true;
        this.form.patchValue(data[0]);
        this.form.get('parent')?.setValue({
          name: data[0].parent.title,
          id: data[0].parent._id
        });
      }
    } catch (error) {
      this.setLoading(false);
    }
    this.setLoading(false);
  }

}
