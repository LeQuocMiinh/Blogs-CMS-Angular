import { NgModule } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
@NgModule({
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        PasswordModule,
        DropdownModule,
        InputTextareaModule,
        InputTextModule,
        FileUploadModule,
        TableModule,
    ],

    exports: [
        InputGroupModule,
        InputGroupAddonModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        PasswordModule,
        DropdownModule,
        InputTextareaModule,
        InputTextModule,
        FileUploadModule,
        TableModule,
    ],
    providers: [MessageService]
})

export class SharedModule { }

