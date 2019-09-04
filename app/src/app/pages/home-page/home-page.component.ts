import { TopicsService } from './../../services/topics.service';
import { QuestionDetailComponent } from './question-detail/question-detail/question-detail.component';
import { QuestionLite, NewQuestion } from './../../models/models-classes';

import { AlertsService } from './../../services/alerts.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { NewQuestionComponent } from './new-question/new-question.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  authResponse;
  questions: QuestionLite[] = [];

  constructor(route: ActivatedRoute, public auth: AuthService, private alertsService: AlertsService,
    public questionsService: QuestionsService, private modalService: NgbModal,
    public topicsService: TopicsService, private router:Router) {
    const code = route.snapshot.queryParams.code;
    if (code) {
      this.auth.getToken(code).subscribe(e => {
        this.authResponse = e;
        this.router.navigate(["/questions"]);
      }, (err) => this.alertsService.getErrorMessageForStatus(err));
    } else {
      this.fetchQuestions();
    }
  }

  fetchQuestions(){
    this.questionsService.getMyQuestions().subscribe(e => this.questions = e);
  }

  ngOnInit() {
  }

  getQuestionDetail(id: string) {
    forkJoin([this.questionsService.getQuestion(id), this.questionsService.getAnswers(id)]).subscribe(
      e => {
        const modalRef = this.modalService.open(QuestionDetailComponent, { windowClass: "animated-fast slideInUp" });
        modalRef.componentInstance.question = e[0];
        modalRef.componentInstance.answers = e[1];
      },
      err => this.alertsService.getErrorMessageForStatus(err)
    )
  }

  newQuestion() {
    this.topicsService.getTopics().subscribe(e => {
      const modalRef = this.modalService.open(NewQuestionComponent, { windowClass: "animated-fast slideInUp" });
      modalRef.componentInstance.topics = e;
      modalRef.result.then(() => {this.fetchQuestions()}, () => {});
    }, err => this.alertsService.getErrorMessageForStatus(err))
  }

}
