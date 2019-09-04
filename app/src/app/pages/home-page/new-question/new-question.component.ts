import { AlertsService, ToastType } from './../../../services/alerts.service';
import { QuestionsService } from './../../../services/questions.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewQuestion, Topic } from 'src/app/models/models-classes';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.scss']
})
export class NewQuestionComponent implements OnInit {

  itemForm: FormGroup;
  executing = false;

  @Input() topics : Topic[] = [];

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    public questionsService: QuestionsService,
    public alertsService: AlertsService) { }

  ngOnInit() {
    this.itemForm = this.formBuilder.group({
      text: ["", Validators.required],
      topic: [this.topics && this.topics.length ? this.topics[0]._id : ""]
    });
  }

  save(){
    let newQues: NewQuestion = {
      text: this.itemForm.value.text,
      topic: this.itemForm.value.topic || undefined,
    };
    this.questionsService.newQuestion(newQues).subscribe(() => {
      this.alertsService.showMessage("Pregunta creada", ToastType.SUCCESS);
      this.activeModal.close();
    }, err => this.alertsService.getErrorMessageForStatus(err));
  }


}
