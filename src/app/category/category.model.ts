export interface ModelCategoriesOption {
    name: string;
    id: string;
}

/**
 * Định nghĩa kiểu dữ liệu được trả về khi gọi api thành công
 */
export interface DataGetAllCategories {
    title: string;
    parent: string;
    description: string;
    image: string;
    slug: string;
    createAt: string;
    updateAt: string;
    deleted: boolean;
}

export interface ParamCreateCategory {
    title: string;
    description: string;
    parent: string;
    image: File;
}