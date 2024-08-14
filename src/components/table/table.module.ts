import { NgModule } from "@angular/core";
import { SharedModule } from "src/modules/shared.module";
import { CommonModule, NgFor } from "@angular/common";
import { TableComponent } from "./table.component";
import { TableModule } from "primeng/table";
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
@NgModule({
    declarations: [TableComponent],
    imports: [
        CommonModule,
        NgFor,
        TableModule,
        ToastModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        ConfirmDialogModule,
        ToolbarModule
    ],
    exports: [TableComponent] // Export the component
})

export class TableCustomerModule { }