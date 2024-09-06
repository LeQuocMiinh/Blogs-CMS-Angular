import { MessageService } from "primeng/api";

export class ShowMessage {
    constructor(
        public mgs: MessageService
    ) {
    }
    /**
 * Hiển thị thông báo 
 * @param severity dạng thông báo
 * @param message nội dung
 * @param reload có reload lại trang hay không ? mặc định false
 */
    showMessage(severity: 'success' | 'error' | 'warning', message: string, reload: { status: boolean, time: number }) {
        const summaryVietnamese = {
            success: "Thành công",
            error: "Lỗi",
            warning: "Cảnh báo"
        };

        this.mgs.add({ severity, summary: summaryVietnamese[severity], detail: message });

        if (reload.status && reload.time > 0) {
            setTimeout(() => window.location.reload(), reload.time);
        }
    }
}