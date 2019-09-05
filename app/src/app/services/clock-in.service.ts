import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable()
export class ClockInService{

    constructor(private http:HttpClient){

    }

    clockIn(){
        return this.http.post(environment.apiUrl + "/api/clock/in", {});
    }

    clockOut(){
        return this.http.post(environment.apiUrl + "/api/clock/out", {});
    }
}