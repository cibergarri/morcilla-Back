import { forkJoin } from 'rxjs';
import { AuthService } from './../../../services/auth.service';
import { AlertsService } from './../../../services/alerts.service';
import { QuestionDetailComponent } from './../question-detail/question-detail/question-detail.component';
import { QuestionsService } from 'src/app/services/questions.service';
import { QuestionLite } from './../../../models/models-classes';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnInit {

  @Input() question: QuestionLite;

  constructor(public questionsService:QuestionsService, private modalService: NgbModal,
    private alertsService: AlertsService, private auth:AuthService) { }

  ngOnInit() {
  }

  getQuestionDetail(id: string) {
    forkJoin([this.questionsService.getQuestion(id), this.questionsService.getAnswers(id)]).subscribe(
      e => {
        const modalRef = this.modalService.open(QuestionDetailComponent, { size:'lg', windowClass: "animated-fast slideInUp" });
        modalRef.componentInstance.question = e[0];
        modalRef.componentInstance.answers = e[1];
        modalRef.componentInstance.me = this.auth.currentUser ? this.auth.currentUser._id == e[0].user._id : false;
      },
      err => this.alertsService.getErrorMessageForStatus(err)
    )
  }


}
