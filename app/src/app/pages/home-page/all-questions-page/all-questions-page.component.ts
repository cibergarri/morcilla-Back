import { PushService } from './../../../services/push.service';
import { QuestionDetailComponent } from './../question-detail/question-detail/question-detail.component';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { QuestionSearch } from './../../../models/models-classes';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionLite, Topic } from 'src/app/models/models-classes';
import { Subject, of, forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-questions-page',
  templateUrl: './all-questions-page.component.html',
  styleUrls: ['./all-questions-page.component.scss']
})
export class AllQuestionsPageComponent implements OnInit, OnDestroy {

  questions: QuestionLite[];
  filterChangeSub = new Subject<QuestionSearch>();
  topics: Topic[] = [];

  constructor(route: ActivatedRoute, public questionsService: QuestionsService, 
    public auth:AuthService, public modalService: NgbModal, public push: PushService) {
    this.questions = route.snapshot.data.questions;
    this.topics = route.snapshot.data.topics;
    this.filterChangeSub.pipe(switchMap(e => this.fetchQuestions(e)))
      .subscribe((questions) => {
        if (questions != null)
          this.questions = questions;
      })
      const openById = route.snapshot.queryParams.openById;
      if(openById){

      }
  }

  ngOnInit() {
  }

  openQuestion(id: string){
    forkJoin([this.questionsService.getQuestion(id), this.questionsService.getAnswers(id)]).subscribe(
      e => {
        const modalRef = this.modalService.open(QuestionDetailComponent, { size:'lg', windowClass: "animated-fast slideInUp" });
        modalRef.componentInstance.question = e[0];
        modalRef.componentInstance.answers = e[1];
        modalRef.componentInstance.me = this.auth.currentUser ? this.auth.currentUser._id == e[0].user._id : false;
      }
    )
  }


  fetchQuestions(qs: QuestionSearch = null) {
    return this.questionsService.getQuestions(qs).pipe(catchError(err => {
      return of(null);
    }));
  }


  onFilterChange(filter: QuestionSearch) {
    this.filterChangeSub.next(filter);
  }

  ngOnDestroy() {
    this.filterChangeSub.unsubscribe();
  }
  testPush(){
    let qu = this.questions[0];
    this.push.push({ type:"push", title: "Mensaje de prueba", body:qu.text, question: qu._id  }).subscribe(() => {});
  }

}
