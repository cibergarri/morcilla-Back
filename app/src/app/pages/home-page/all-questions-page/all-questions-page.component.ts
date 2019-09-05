import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { QuestionSearch } from './../../../models/models-classes';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from 'src/app/services/questions.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionLite, Topic } from 'src/app/models/models-classes';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-all-questions-page',
  templateUrl: './all-questions-page.component.html',
  styleUrls: ['./all-questions-page.component.scss']
})
export class AllQuestionsPageComponent implements OnInit, OnDestroy {

  questions: QuestionLite[];
  filterChangeSub = new Subject<QuestionSearch>();
  topics: Topic[] = [];

  constructor(route: ActivatedRoute, public questionsService: QuestionsService) {
    this.questions = route.snapshot.data.questions;
    this.topics = route.snapshot.data.topics;
    this.filterChangeSub.pipe(switchMap(e => this.fetchQuestions(e)))
      .subscribe((questions) => {
        if (questions != null)
          this.questions = questions;
      })
  }

  ngOnInit() {
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

}
