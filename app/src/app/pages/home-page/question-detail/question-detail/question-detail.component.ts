import { AuthService } from './../../../../services/auth.service';
import { AlertsService, ToastType } from './../../../../services/alerts.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  executing = false;
  itemForm: FormGroup;

  @Input() me: boolean;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
    public questionsService: QuestionsService, private alertsService: AlertsService,
      private auth: AuthService) {
    this.itemForm = this.formBuilder.group({
      text: ["", Validators.required],
    });
  }

  ngOnInit() {
  }

  answer(){
   this.questionsService.answer(this.question._id, this.itemForm.value.text).subscribe(
     (r) => { 
      if(!r.user.photo)
        r.user = this.auth.currentUser;
      this.answers.push(r)
      this.itemForm.patchValue( { text:""});
    }
     , (err) => this.alertsService.getErrorMessageForStatus(err)
   );
  }

  acceptAnswer(an:Answer){
    this.questionsService.acceptAnswer(an._id).subscribe(() => { 
      an.accepted = true;
      this.alertsService.showMessage("¡Gracias por aceptar la respuesta!", ToastType.SUCCESS);
    }, err => this.alertsService.getErrorMessageForStatus(err));
  }

}