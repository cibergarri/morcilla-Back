import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  logoutEvents: Subject<boolean> = new Subject<boolean>();
  loginEvents: Subject<boolean> = new Subject<boolean>();

  static readonly ACCESS_TOKEN: string = "access_token";

  constructor(private http: HttpClient) { }

  getToken(code: string) {
    return this.http.post<string>(environment.apiUrl + `/auth/github/token?code=${code}`, {}).pipe(tap((token) => {
      if(token)
        this.storeToken(token);
      this.loginEvents.next(true);
    }));
  }

  silentLogin() {
    return this.http.get<any>(environment.apiUrl + "/auth/github").pipe(switchMap(res => {
      const code = res.code;
      return this.getToken(code);
    }),catchError((err) => {err.status = 401; throw err; }));
  }

  getStoredToken() {
    return localStorage.getItem(AuthService.ACCESS_TOKEN);
  }

  private storeToken(token:string){
    localStorage.setItem(AuthService.ACCESS_TOKEN, token);
  }

  logout(initiatedByUser: boolean){
    this.storeToken(null);
    this.logoutEvents.next(initiatedByUser);
    return of(initiatedByUser);
  }

}
