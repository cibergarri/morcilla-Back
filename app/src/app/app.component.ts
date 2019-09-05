import { PushService } from './services/push.service';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { Event, Router, NavigationError, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { fadeInDownOutUp, fadeInOut } from './animations';
import { Subscription } from 'rxjs';
import { AlertsService } from './services/alerts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInDownOutUp, fadeInOut]
})
export class AppComponent {
  logoutSub: Subscription;
  navigating: boolean = false;

  loadingApp: boolean = true;

  barIsCollapsed = true;
  loaderImg = "assets/imgs/loader.svg";

  constructor(public obsAlertsSrv: AlertsService,
    private router: Router, public auth: AuthService) {
    this.logoutSub = auth.logoutEvents.subscribe(() => {
      this.router.navigate(["/landing"]);
    });
    this.routeNavigation(router);
    if (!this.supportsSvg())
      this.loaderImg = "assets/imgs/loader.gif";
      this.loadingApp = false;
  }

  private supportsSvg() {
    return document && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
  }

  ngOnDestroy() {
    this.logoutSub.unsubscribe();
  }

  routeNavigation(router: Router) {
    router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.navigating = true;
          this.barIsCollapsed = true;
          break;
        }

        case event instanceof NavigationEnd: {
          if (window)
            scrollTo(0, 0);
        } //no break, fall down the switch
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.navigating = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }



}
