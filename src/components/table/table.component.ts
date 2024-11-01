import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ColumnInterface } from './table.model';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [ConfirmationService]
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() cols: ColumnInterface[] = [];
  @Input() stt: boolean = false;
  @Input() search: boolean = false;
  @Input() pagination: boolean = false;
  @Input() first: number = 0;
  @Input() rows: number = 5;
  @Input() onCheckboxRow: boolean = true;
  @Input() onTrash: boolean = true;
  @Output() actionHandle = new EventEmitter<any>();

  isTrash: boolean = false;
  interfaceTableData: any;
  selectedRows: any[] = [];
  dataAfterHandle: any;
  dataOriginHandle: any;
  globalFilterArgs: any[] = [];
  rowsPerPageOptions: any[] = [5, 10, 25, 50];
  showCurrentPageReport: boolean = true;

  @ViewChild('dt') dt!: Table;

  constructor(
    private confirmationService: ConfirmationService
  ) {
  }

  async ngOnInit() {
    await this.setDisplayColumn();
    await this.setData(this.data);
  }

  /**
   * Sự kiện thay đổi
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.setData(this.data);
    }
  }

  /**
   * Xử lý và hiển thị các cột
   */
  async setDisplayColumn() {
    this.globalFilterArgs = this.cols.map((col: any) => { return col.name });
    const displayColumn = (this.stt) ? 'auto' : 'none';
    this.cols.unshift({ title: 'STT', name: 'stt', width: '6rem', align: 'center', display: displayColumn });
  }

  /**
   * Xử lý dữ liệu truyền vào
   */
  async setData(data: any) {
    this.dataOriginHandle = data.map((item: any, index: number) => {
      return { stt: index + 1, ...item };
    })
    this.dataAfterHandle = data.map((item: any, index: number) => {
      let newItem: any = {};

      for (let index = 0; index < this.globalFilterArgs.length; index++) {
        let key = this.globalFilterArgs[index];
        newItem[key] = item[key]; // lấy dữ liệu theo key của column
      };
      // Kiểm tra và thực thi render cho mỗi cột
      for (let j = 0; j < this.cols.length; j++) {
        let col = this.cols[j];
        if (this.isRender(col)) {
          if (col.render) {
            // Áp dụng hàm render nếu tồn tại
            newItem[col.name] = col.render(item);
          }
        }
      }
      newItem = { stt: index + 1, ...newItem };
      return newItem;
    });
  }

  /**
   * Lấy tất cả các giá trị của 1 object
   * @param obj 
   * @returns 
   */
  objectValues(obj: any): any[] {
    return Object.values(obj);
  }

  /**
   * Tìm kiếm dòng dựa vào các key của globalFilterArgs
   * @param event 
   */
  onFilterGlobal(event: any) {
    this.dt.filterGlobal(event.target.value, 'contains');
  }

  /**
   * Chọn dòng
   */
  onSelectRow(event: any) {
    const data = this.selectedRows.map((selected: any) => {
      return this.dataOriginHandle.find((e: any) => e.stt === selected.stt);
    }).filter((item: any) => item !== undefined);
  }

  /**
   * Gửi hành động mà người dùng click 
   * @param action hành động (vd: sửa, xóa)
   * @param rows dòng
   */
  bindAction(action: string) {
    const data = this.selectedRows.map((selected: any) => {
      return this.dataOriginHandle.find((e: any) => e.stt === selected.stt);
    }).filter((item: any) => item !== undefined);
    this.actionHandle.emit({
      action: action,
      rows: data
    });
  }

  /**
   * Xem thùng rác hoặc xem danh sách hiện tại
   * @param action 
   */
  toggleViewTrashOrList(action: string) {
    this.selectedRows = [];
    this.actionHandle.emit({
      action: action
    });
    this.isTrash = (action === 'view-trash') ? true : false;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isRender(col: any): boolean {
    return typeof col.render === 'function';
  }

  /**
   * Custom style cho cột
   * @param column 
   * @returns 
   */
  styleColumn(column: ColumnInterface) {
    const styles = {
      'text-align': column.align || undefined,
      'background-color': column.backgroundColor || undefined,
      'font-size': column.fontSize || undefined,
      'font-weight': column.fontWeight || undefined,
      'font-style': column.fontStyle || undefined,
      'width': column.width || undefined,
      'min-width': column.minWidth || undefined,
      'padding': column.padding || undefined,
      'margin': column.margin || undefined,
      'cursor': column.action ? 'pointer' : 'auto',
      'display': column.display || 'auto',
      'height': column.height || 'auto',
      'overflow': column.overflow || undefined
    }
    return styles;
  }

}
