import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsPageComponent } from './stats-page.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StatCircleComponent } from './stat-circle/stat-circle.component';

const routes: Routes = [
  { path: '', component: StatsPageComponent },
];

@NgModule({
  declarations: [StatsPageComponent, StatCircleComponent],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    NgCircleProgressModule,
    RouterModule.forChild(routes)
  ]
})
export class StatsPageModule { }
