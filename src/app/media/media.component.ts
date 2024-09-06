import { Component, ElementRef, ViewChild } from '@angular/core';
import { MediaService } from './media.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Loading } from 'src/libs/loading';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  providers: [MediaService, MessageService, ConfirmationService]
})
export class MediaComponent {
  images: any[] = [];
  loading: Loading = new Loading();
  uploadedFiles: any[] = [];
  selectedImages: any[] = [];
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private mediaService: MediaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  async ngOnInit() {
    await this.getAllMedia();
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
   * Mở thư mục để chọn files
   */
  triggerFileUpload() {
    this.fileUpload.choose();
  }

  /**
   * Chọn files
   * @param event 
   */
  async onSelectedFiles(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    await this.uploadImages();
  }

  /**
   * Chọn hình ảnh
   * @param event 
   * @param index 
   */
  async onSelectImages(event: any, index: number) {
    const value = event.checked;
    event.index = index;
    value.map((item: any) => { item.index = index });
    this.selectedImages = [...this.selectedImages, ...value];
    if (event.checked.length == 0) {
      this.selectedImages = this.selectedImages.filter((e: any) => e.index != event.index);
    }
  }

  /**
   * Hàm lấy tất cả hình ảnh
   */
  async getAllMedia() {
    try {
      this.loading.setLoading(true);
      const res = await this.mediaService.getAllMedia();
      this.images = res.data;
    } catch (error) {
      this.loading.setLoading(false);
    } finally { this.loading.setLoading(false) };
  }

  /**
  * Hàm upload hình ảnh lên cloudinary
  */
  async uploadImages() {
    this.loading.setLoading(true);
    try {
      const form = new FormData;
      const files = this.uploadedFiles;
      if (files.length > 0) {
        files.forEach((file, index) => {
          form.append('images', file);
        })
      }
      const res = await this.mediaService.uploadMedia(form);
      this.showMessage('success', res.message, { status: false, time: 0 });
    } catch (error: any) {
      this.loading.setLoading(false);
      this.showMessage('error', error?.message, { status: false, time: 0 });
    } finally {
      this.getAllMedia();
      this.uploadedFiles = [];
    }
  }

  /**
   * Hàm xóa hình ảnh
   */
  async deletedMedia() {
    this.confirmationService.confirm({
      message: 'Xác nhận xóa vĩnh viễn ?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: async () => {
        this.loading.setLoading(true);
        const ids = this.selectedImages.map((item: any) => { return item.public_id.split('/')[1] });
        try {
          const res = await this.mediaService.deletedMedia(ids);
          this.showMessage('success', res.message, { status: false, time: 0 });
        } catch (error: any) {
          this.loading.setLoading(false);
          this.showMessage('error', error.message, { status: false, time: 0 });
        } finally {
          this.getAllMedia();
          this.selectedImages = [];
        }
      }
    });
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
