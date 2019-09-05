import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable()
export class ClockInService {

    constructor(private http: HttpClient, private auth: AuthService) {
        this.auth.logoutEvents.pipe(switchMap(() => {
            return this.clockOut();
        })).subscribe(() => { });

    }

    clockIn() {
        return this.http.post(environment.apiUrl + "/api/clock/in", {});
    }

    clockOut() {
        return this.http.post(environment.apiUrl + "/api/clock/out", {});
    }
}