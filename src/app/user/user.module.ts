import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { TableComponent } from 'src/components/table/table.component';
import { TableCustomerModule } from 'src/components/table/table.module';


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TableCustomerModule
  ]
})
export class UserModule { }
