import { AuthService } from 'src/app/services/auth.service';
import { Injectable, Injector } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()
export class UserGuard implements CanActivate, CanActivateChild {

  constructor(private inj: Injector) { }

  canActivate(): Observable<boolean> {
    const auth =  this.inj.get(AuthService);
    if(auth.currentUser)
        return of(true);
    return auth.getCurrentUser().pipe(map(result => {
      return true;
    }), catchError(() => of(false)));
  }

  canActivateChild(){
      return this.canActivate();
  }
}
