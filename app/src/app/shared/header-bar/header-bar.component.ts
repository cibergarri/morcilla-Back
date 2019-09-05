import { Project } from './../../models/models-classes';
import { ProjectsService } from './../../services/projects.service';
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
  projects: Project[];

  constructor(public router: Router,
    public auth: AuthService,
    public clockInService: ClockInService,
    public projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.navbarActive = this.isNavbarActive();
    this.projectsService.getProjects().subscribe(items => { 
      this.projects = items;
    });
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
      catchError(() => this.auth.logout(true))
    ).subscribe(() => { });
  }

  isLoginRoute() {
    return this.router.url.startsWith("/landing");
  }

  changeCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.next(this.collapsed);
  }

  clockIn(projId: string = undefined) {
    this.clockInService.clockIn(projId).subscribe(() => this.auth.currentUser.status = "active");
  }

  changeStatus() {
    if (this.auth.currentUser.status === "inactive") {
      if (!this.projects || !this.projects.length)
        this.clockIn();
    } else
      this.clockInService.clockOut().subscribe(() => this.auth.currentUser.status = "inactive");
  }

}
