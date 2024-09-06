import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';
import { TableCustomerModule } from 'src/components/table/table.module';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ModalMediaModule } from 'src/components/modal-media/modal-media.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from 'src/modules/shared.module';

@NgModule({
  declarations: [
    TagComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    SharedModule,
    TableCustomerModule,
    SkeletonModule,
    DialogModule,
    DynamicDialogModule,
    ModalMediaModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class TagModule { }
