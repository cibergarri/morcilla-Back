import { AlertsService } from './../services/alerts.service';
import { QuestionsService } from './../services/questions.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { StatsService } from '../services/stats.service';

@Injectable()
export class StatsResolver implements Resolve<any> {

  constructor(private statsService: StatsService, private alertsSrv: AlertsService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.statsService.getMyStats().pipe(catchError(err => {
      this.alertsSrv.getErrorMessageForStatusIfNotPresent(err);
      throw err;
    }));
  }
}
