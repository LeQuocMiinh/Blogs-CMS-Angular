import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ModalMediaComponent } from './modal-media.component';
import { RadioButtonModule } from 'primeng/radiobutton';
@NgModule({
    declarations: [
        ModalMediaComponent
    ],
    imports: [
        CommonModule,
        ImageModule,
        FileUploadModule,
        FormsModule,
        CheckboxModule,
        ToastModule,
        RadioButtonModule
    ],
    providers: [MessageService]
})
export class ModalMediaModule { }
