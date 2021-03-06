import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  gitLoginUrl: string;
  constructor() { 
    this.gitLoginUrl = environment.apiUrl + "/auth/github";
  }

  ngOnInit() {
  }

}
