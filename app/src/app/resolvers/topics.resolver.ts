import { AlertsService } from './../services/alerts.service';
import { QuestionsService } from './../services/questions.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { TopicsService } from '../services/topics.service';

@Injectable()
export class TopicsResolver implements Resolve<any> {

  constructor(private topicsService: TopicsService, private alertsSrv: AlertsService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.topicsService.getTopics().pipe(catchError(err => {
      this.alertsSrv.getErrorMessageForStatusIfNotPresent(err);
      throw err;
    }));
  }
}
