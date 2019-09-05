import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable()
export class ClockInService {

    constructor(private http: HttpClient) {
    }

    clockIn(projId: string = undefined) {
        return this.http.post(environment.apiUrl + "/api/clock/in", {project: projId});
    }

    clockOut() {
        return this.http.post(environment.apiUrl + "/api/clock/out", {});
    }
}