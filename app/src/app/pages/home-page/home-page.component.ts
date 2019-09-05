import { TopicsService } from './../../services/topics.service';
import { QuestionDetailComponent } from './question-detail/question-detail/question-detail.component';
import { QuestionLite, NewQuestion, QuestionSearch } from './../../models/models-classes';

import { AlertsService } from './../../services/alerts.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  authResponse;
  questions: QuestionLite[] = [];

  constructor(route: ActivatedRoute, public auth: AuthService, private alertsService: AlertsService,
    public questionsService: QuestionsService, private modalService: NgbModal, private router: Router) {
    const code = route.snapshot.queryParams.code;
    if (code) {
      this.auth.getToken(code).subscribe(e => {
        this.authResponse = e;
        this.router.navigate(["/questions", "me"]);
      }, (err) => this.alertsService.getErrorMessageForStatus(err));
    } else {
      this.questions = route.snapshot.data.questions;
    }
  }

  fetchQuestions() {
    this.questionsService.getMyQuestions().subscribe(e => this.questions = e);
  }


  ngOnInit() {
  }




}
