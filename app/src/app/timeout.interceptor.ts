import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { timeout } from 'rxjs/operators';
import { environment } from "../environments/environment";

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutVal = Number(req.headers.get('timeout')) || environment.httpTimeout;
    return next.handle(req).pipe(timeout(timeoutVal));
  }
}
