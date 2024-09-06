import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { MediaService } from 'src/app/media/media.service';
import { Loading } from 'src/libs/loading';

@Component({
  selector: 'app-modal-media',
  templateUrl: './modal-media.component.html',
  styleUrls: ['./modal-media.component.scss'],
  providers: [MediaService]
})
export class ModalMediaComponent implements OnInit {
  selectedImages: any;
  uploadedFiles: any[] = [];
  images: any[] = [];
  loading: Loading = new Loading();
  typeChecked: string = '';
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private mediaService: MediaService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {

  }

  async ngOnInit() {
    this.typeChecked = this.dynamicDialogConfig.data.typeChecked;
    await this.getAllMedia();
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
 * Mở thư mục để chọn files
 */
  triggerFileUpload() {
    this.fileUpload.choose();
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
      await this.mediaService.uploadMedia(form);
    } catch (error: any) {
      this.loading.setLoading(false);
    } finally {
      this.getAllMedia();
      this.uploadedFiles = [];
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

  async submit() {
    this.ref.close(this.selectedImages);
  }

  onCancel() {
    this.ref.close();
  }
}
