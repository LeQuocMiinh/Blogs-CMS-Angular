
// Định nghĩa kiểu dữ liệu gửi đi lấy dữ liệu các bài viết có nhiều lượt xem 
export interface ParamGetPostMostViews {
    option: string; // [recent, all] - lấy bài viết mới nhất hay [nums] trên tổng số bài viết
    nums: number; // số lượng bài viết
}

// Định nghĩa kiểu dữ liệu gửi đi lấy dữ liệu lượt xem của bài viết có nhiều lượt xem nhất
export interface ParamGetDataViewsByPostId {
    id: string; // id bài viết
    option: string; // [day] 
}

