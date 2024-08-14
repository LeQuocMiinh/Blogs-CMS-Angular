import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { SharedModule } from 'src/modules/shared.module';
import { TableCustomerModule } from 'src/components/table/table.module';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    TableCustomerModule,
    SkeletonModule,
    DialogModule
  ],
  providers: []
})
export class CategoryModule { }
