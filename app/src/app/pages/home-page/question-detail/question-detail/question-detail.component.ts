import { Question, Answer } from './../../../../models/models-classes';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {

  @Input() question: Question;
  @Input() answers: Answer[];

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }

}
