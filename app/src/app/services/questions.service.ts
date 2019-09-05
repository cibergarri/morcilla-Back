import { Answer, Question, NewQuestion, QuestionSearch } from './../models/models-classes';
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

  getQuestions(search: QuestionSearch = null){
    let query = "";
    if(search){
      query += `?topic=${search.topicId || '' }&text=${encodeURIComponent(search.text || '')}`
    }
    return this.http.get<QuestionLite[]>(environment.apiUrl + `/api/questions` + query);
  }

  getQuestion(id: string){
    return this.http.get<Question>(environment.apiUrl + `/api/questions/${id}`);
  }

  getAnswers(questionId:string){
    return this.http.get<Answer[]>(environment.apiUrl + `/api/questions/${questionId}/answers`);
  }

  answer(questionId: string, text: string){
    return this.http.post<Answer>(environment.apiUrl + `/api/questions/${questionId}/answers`, {text });
  }

  newQuestion(question: NewQuestion){
    return this.http.post<Question>(environment.apiUrl + `/api/questions`, question);
  }

  acceptAnswer(answerId:string ){
    return this.http.put(environment.apiUrl + `/api/answers/${answerId}/accepted`, {accepted:true});
  }

}
