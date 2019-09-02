import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { switchMap, catchError, filter, take, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  auth: AuthService;

  isRefreshingToken: boolean = false;

  private blackList =
  [];

  constructor(private inj: Injector) {

  }

  isProtectedUrl(url: string): boolean {
    return !this.blackList.some(pUrl => url.indexOf(pUrl) > -1);
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
  }


  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.auth.tokenSubject.next(null);

      return this.auth.silentLogin().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.auth.tokenSubject.next(newToken);
            return next.handle(this.addToken(req, newToken));
          }
          // If we don't get a new token, we are in trouble so implicit logout.
          return this.implicitLogout(req);
        }), catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so implicit logout.
          return this.implicitLogout(req);
        }), finalize(() => this.isRefreshingToken = false));
    } else {
      return this.auth.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token as string));
        }));
    }
  }

  implicitLogout(req: HttpRequest<any>): Observable<any> {
    //this.auth.loginStatus = null;
    return this.auth.logout(false).pipe(switchMap(() => throwError(new HttpErrorResponse({ status: 401, statusText: "no access token available" }))));
    //return throwError(new HttpErrorResponse({ status: 401, statusText: "no access token available" }));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isProtectedUrl(req.url))
      return next.handle(req);
    this.auth = this.auth || this.inj.get(AuthService);
    let accessToken = this.auth.getStoredToken();
    if (!accessToken)
        return next.handle(req);
    let clonedReq: HttpRequest<any> = this.addToken(req, accessToken as string);
    return next.handle(clonedReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && (<HttpErrorResponse>error).status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      }));
  }
}
