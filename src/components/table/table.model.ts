export interface ColumnInterface {
    stt?: number,
    //Tên hiển thị của cột
    title: string,
    //Tên định danh của cột (vd: title: sách => name: book)
    name: string,
    //Hàm này thay đổi cách hiển thị của cột (vd: format date)
    render?: any,
    //Tùy chỉnh css
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: number;
    fontStyle?: string;
    padding?: string;
    margin?: string;
    align?: string,
    width?: string,
    minWidth?: string,
    action?: string,
    display?: string,
    height?: string,
    overflow?: string
}
