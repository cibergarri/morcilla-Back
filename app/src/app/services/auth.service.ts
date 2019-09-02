import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private http: HttpClient) { }

getToken(code: string){
  return this.http.post<any>(environment.apiUrl+`/github/token?code=${code}`, {});
}

}
