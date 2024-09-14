import { Component, Inject, inject, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalMediaComponent } from 'src/components/modal-media/modal-media.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { CategoryService } from 'src/app/category/category.service';
import { TagService } from 'src/app/tag/tag.service';
import { Loading } from 'src/libs/loading';
import { PostComponent } from '../post.component';
import { ShowMessage } from 'src/libs/show-message';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  providers: [
    PostService,
    CategoryService,
    TagService,
    DialogService
  ],
})
export class PostDetailComponent extends ShowMessage {
  loading: Loading = new Loading();
  form!: FormGroup;
  content: string = 'content';
  introduceOption = {
    heading: 'Thêm bài viết',
    textBtn: 'Đăng bài'
  };
  status = [
    { name: "Công khai", value: 'published' },
    { name: "Bản nháp", value: 'draft' },
    { name: "Riêng tư", value: 'privated' }
  ];
  ref: DynamicDialogRef | undefined;
  typeChecked: string = 'radio';
  imageSelected: string = '';
  statusSelected: string = 'draft';
  currentDate: string = '---';
  categories: any;
  tags: any;
  postId: string = '';
  isEdit: boolean = false;

  constructor(
    public postService: PostService,
    public categoryService: CategoryService,
    public tagService: TagService,
    public fb: FormBuilder,
    public dialogService: DialogService,
    public datePipe: DatePipe,
    public messageService: MessageService,
    public activatedRoute: ActivatedRoute
  ) {
    super(messageService)
  }

  async ngOnInit() {
    this.initForm();
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
    await this.getAllCategories();
    await this.getAllTags();
    this.activatedRoute.params.subscribe(async params => {
      if (params['id'] && params['id'] != 'post-detail') {
        this.postId = params['id'];
        this.isEdit = true;
        const res: any = await this.getPostDetails(params['id']);
        this.form.patchValue(res.data);
        this.imageSelected = (res.data.image != null) ? res.data.image : '';
        this.currentDate = this.datePipe.transform(res.data.createdAt, 'dd/MM/yyyy') || '';
        const statusFromResponse = this.status.find(e => e.value === res.data.status);
        this.form.get('status')?.patchValue(statusFromResponse);
        this.introduceOption = {
          heading: 'Sửa bài viết',
          textBtn: 'Cập nhật'
        }
      }
    })
  }

  /**
   * Khởi tạo form
   */
  initForm() {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      description: [null],
      content: [null],
      category: [null],
      tag: [null],
      status: this.status[1],
      image: [null]
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

  /**
   * Lấy chi tiết bài viết
   * @param id 
   * @returns 
   */
  async getPostDetails(id: string) {
    this.loading.setLoading(true);
    const res = await this.postService.getPostDetails(id);
    this.loading.setLoading(false);
    return res;
  }

  /**
   * Lấy tất cả danh mục
   */
  async getAllCategories() {
    this.loading.setLoading(true);
    const res: any = await this.categoryService.getAllCategories([]);
    this.categories = res.data.filter((item: any) => !item.deleted);
    this.loading.setLoading(false);
  }

  /**
   * Lấy tất cả các thẻ
   */
  async getAllTags() {
    this.loading.setLoading(true);
    const res: any = await this.tagService.getAllTags();
    this.tags = res.data.filter((item: any) => !item.deleted);
    this.loading.setLoading(false);
  }

  /**
   * Nhấn đăng bài
   */
  async submit() {
    const valueForm = this.form.value;
    valueForm.status = valueForm.status.value;
    const promises = this.isEdit ? this.postService.updatePost(this.postId, valueForm) : this.postService.createPost(valueForm)
    this.loading.setLoading(true);
    promises.then((res: any) => {
      if (res.status) {
        this.showMessage('success', res.message, { status: true, time: 1000 });
      }
    }).catch(error => {
      this.showMessage('error', error.message, { status: true, time: 1000 });
    }).finally(() => { this.loading.setLoading(false); })
  }

}
