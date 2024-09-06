export class Loading {

    /**
    * Bật/tắt hiệu ứng loading
    * @param value 
    */
    setLoading(value: boolean) {
        const loadingHtml = document.getElementById('loading');
        if (loadingHtml) {
            loadingHtml.style.display = (value) ? 'flex' : 'none';
        }
    }

}