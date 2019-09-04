import { Answer, Question, NewQuestion } from './../models/models-classes';
import { QuestionLite } from '../models/models-classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class QuestionsService {

  constructor(private http: HttpClient) {

  }

  getMyQuestions(){
    return this.http.get<QuestionLite[]>(environment.apiUrl + "/api/questions/me");
  }

  getQuestion(id: string){
    return this.http.get<Question>(environment.apiUrl + `/api/questions/${id}`);
  }

  getAnswers(questionId:string){
    return this.http.get<Answer[]>(environment.apiUrl + `/api/questions/${questionId}/answers`);
  }

  newQuestion(question: NewQuestion){
    return this.http.post<Question>(environment.apiUrl + `/api/questions`, question);
  }

}
