import { AlertsService } from './../../services/alerts.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  authResponse;

  constructor(route: ActivatedRoute, private auth: AuthService, private alertsService:AlertsService) {
    const code = route.snapshot.queryParams.code;
    if(code){
      this.auth.getToken(code).subscribe(e => { 
        this.authResponse = e;
        console.log(e);
      }, (err) => this.alertsService.getErrorMessageForStatus(err) );
    }
   }

  ngOnInit() {
  }

}
