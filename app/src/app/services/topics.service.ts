import { Topic } from './../models/models-classes';
import { QuestionLite } from '../models/models-classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class TopicsService {

    constructor(private http: HttpClient) {

    }

    getTopics() {
        return this.http.get<Topic[]>(environment.apiUrl + "/api/Topics");
    }

}
