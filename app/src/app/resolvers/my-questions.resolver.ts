import { AlertsService } from './../services/alerts.service';
import { QuestionsService } from './../services/questions.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MyQuestionsResolver implements Resolve<any> {

  constructor(private questionsService: QuestionsService, private alertsSrv: AlertsService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.questionsService.getMyQuestions().pipe(catchError(err => {
      this.alertsSrv.getErrorMessageForStatusIfNotPresent(err);
      throw err;
    }));
  }
}
