import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuestionDetailComponent } from './question-detail/question-detail/question-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { NewQuestionComponent } from './new-question/new-question.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
];


@NgModule({
  declarations: [HomePageComponent, QuestionDetailComponent, NewQuestionComponent],
  entryComponents: [QuestionDetailComponent, NewQuestionComponent],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class HomePageModule { }
