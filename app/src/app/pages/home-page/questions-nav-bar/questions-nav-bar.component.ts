import { QuestionSearch } from './../../../models/models-classes';
import { Topic } from 'src/app/models/models-classes';
import { AlertsService } from './../../../services/alerts.service';
import { NewQuestionComponent } from './../new-question/new-question.component';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicsService } from 'src/app/services/topics.service';
import { debounceTime } from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-questions-nav-bar',
  templateUrl: './questions-nav-bar.component.html',
  styleUrls: ['./questions-nav-bar.component.scss']
})
export class QuestionsNavBarComponent implements OnInit, OnDestroy {

  @Output() onNewQuestion = new EventEmitter<any>();
  @Output() onFilterChange = new EventEmitter<QuestionSearch>();
  @Input() showSearchControls = false;
  @Input() topics: Topic[] = [];
  search: QuestionSearch = { text: "", topicId: "" };
  textChange = new Subject<string>();

  constructor(private modalService: NgbModal, private alertsService: AlertsService,
    public topicsService: TopicsService) {
      this.textChange.pipe(debounceTime(500)).subscribe(e => {
        this.onFilterChange.next(this.search);
      });

     }

  ngOnInit() {
  }


  onTextChange(value) {
    this.search.text = value;
    this.textChange.next(value);
  }

  onTopicChange(value) {
    this.search.topicId = value;
    this.onFilterChange.next(this.search);
  }


  onQuestionAddClick() {
    this.topicsService.getTopics().subscribe(e => {
      const modalRef = this.modalService.open(NewQuestionComponent, { size: 'lg', windowClass: "animated-fast slideInUp" });
      modalRef.componentInstance.topics = e;
      modalRef.result.then(() => { this.onNewQuestion.next() }, () => { });
    }, err => this.alertsService.getErrorMessageForStatus(err))
  }

  ngOnDestroy() {
    if (!this.textChange.closed)
      this.textChange.unsubscribe();
  }

}



