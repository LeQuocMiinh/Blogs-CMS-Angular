import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PostDetailRoutingModule } from './post-detail-routing.module';
import { PostDetailComponent } from './post-detail.component';
import { SharedModule } from 'src/modules/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    PostDetailRoutingModule,
    SharedModule,
    CheckboxModule,
    EditorModule,
  ],
  providers: [
    MessageService,
    DatePipe,
  ],
})
export class PostDetailModule { }
