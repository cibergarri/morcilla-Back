import { TopicsResolver } from './../../resolvers/topics.resolver';
import { QuestionsResolver } from './../../resolvers/questions.resolver';
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
import { QuestionsNavBarComponent } from './questions-nav-bar/questions-nav-bar.component';
import { AllQuestionsPageComponent } from './all-questions-page/all-questions-page.component';
import { QuestionCardComponent } from './question-card/question-card.component';


const routes: Routes = [
  { path: 'me', component: HomePageComponent },
  { path: 'all', component: AllQuestionsPageComponent, resolve: {questions: QuestionsResolver, topics: TopicsResolver}}
];


@NgModule({
  declarations: [HomePageComponent, QuestionDetailComponent, NewQuestionComponent, QuestionsNavBarComponent, AllQuestionsPageComponent, QuestionCardComponent],
  entryComponents: [QuestionDetailComponent, NewQuestionComponent, AllQuestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[QuestionsResolver, TopicsResolver]
})
export class HomePageModule { }
