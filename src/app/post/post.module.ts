import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { TableCustomerModule } from 'src/components/table/table.module';
import { SharedModule } from 'src/modules/shared.module';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    TableCustomerModule,
    SharedModule,
    TagModule
  ]
})
export class PostModule { }
