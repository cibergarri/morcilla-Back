import { switchMap, catchError } from 'rxjs/operators';
import { ClockInService } from './../../services/clock-in.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  @Input() collapsed: boolean = true;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  navbarActive = "";

  constructor(public router: Router,
    public auth: AuthService,
    public clockInService: ClockInService) {
  }

  ngOnInit() {
    this.navbarActive = this.isNavbarActive();
  }



  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.navbarActive = this.isNavbarActive();
  }

  isNavbarActive() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    return number > 50 ? "active" : "";
  }

  logout() {
    this.clockInService.clockOut().pipe(
      switchMap(() => this.auth.logout(true)),
      catchError(() =>  this.auth.logout(true))
    ).subscribe(() => { });
  }

  isLoginRoute() {
    return this.router.url.startsWith("/landing");
  }

  changeCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.next(this.collapsed);
  }

  changeStatus(){
    if(this.auth.currentUser.status === "inactive")
      this.clockInService.clockIn().subscribe(() => this.auth.currentUser.status="active");
    else
    this.clockInService.clockOut().subscribe(() => this.auth.currentUser.status="inactive");
  }
 
}
