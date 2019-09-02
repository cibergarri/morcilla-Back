import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private auth: AuthService, private router: Router) {
    //no need to unsubscribe to an observer that is to work on the full page lifecycle
    this.auth.logoutEvents.subscribe(e => this.router.navigate(["/landing"]))
  }

}
