/**
 * Định nghĩa kiểu dữ liệu được trả về khi gọi api thành công
 */
export interface DataGetAllTags {
    title: string;
    parent: string;
    description: string;
    image: string;
    slug: string;
    createAt: string;
    updateAt: string;
    deleted: boolean;
}

export interface ParamCreateTag {
    title: string;
    description: string;
}