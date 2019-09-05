import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { PushNotification } from '../models/models-classes';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PushService {
    publicVapidKey = 'BJWz0WH_FhdpLtLG_meBK1U-nkVvZJ4VtS7F3sLSWhPIvasHZ3qxpRJNNItZZYju0qU3T4UeacBOqbciagW0fSg';

    subscribed = false;

    constructor(private http: HttpClient, private auth: AuthService) {
        this.auth.userEvents.pipe(switchMap(
            (u) => {  
                if (u && !this.subscribed) {
                    return of(this.run());
                }
                of(null);
            })).subscribe(() => {
                this.subscribed = true;
            });
        this.auth.logoutEvents.subscribe(() => {
            if (this.subscribed && (window as any).pushNotificationEventListener) {
                window.removeEventListener('push', (window as any).pushNotificationEventListener);
                this.subscribed = false;
            }
        }) 
    }

    init() {
        if ('serviceWorker' in navigator) {
            console.log('Registering service worker');
            return this.run().catch(error => console.error(error));
        }
        return Promise.resolve();
    }


    private async run() {
        console.log('Registering service worker');
        const registration = await navigator.serviceWorker.
            register('./worker.js', { scope: '/push/' });
        console.log('Registered service worker');

        console.log('Registering push');
        const subscription = await registration.pushManager.
            subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
            });
        console.log('Registered push');
        return await this.http.post(environment.apiUrl + '/api/notifications/push/subscribe', subscription).toPromise();
    }

    private urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    push(not: PushNotification) {
        return this.http.post(environment.apiUrl + "/api/notifications", not);
    }

}




