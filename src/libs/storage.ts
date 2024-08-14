import { environment } from "../environments/environment";

export class AppStorage {

    storage: any = sessionStorage;

    getItem(key: string, defaultValue: any = null as any): string {
        return this.storage.getItem(this.getAppKey(key)) || defaultValue;
    }

    setItem(key: string, value: any): string {
        return this.storage.setItem(this.getAppKey(key), value);
    }

    removeItem(key: string): string {
        return this.storage.removeItem(this.getAppKey(key));
    }

    clear(): string {
        return this.storage.clear();
    }

    getAppKey(name: string): string {
        return environment.appName + '_' + name;
    }

}
