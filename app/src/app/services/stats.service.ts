import { StatLevel, StatLevelResult } from './../models/models-classes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { UserStats } from '../models/models-classes';

@Injectable()
export class StatsService {

    questionLevel: StatLevel[] = [{ level: 0, title:"Novato", color: '#525252', amount: 0 }, { level: 1, title:"Iniciado", color: '#916323', amount: 10 }, { level: 2, title:"Avanzado", color: '#a9b8b7', amount: 50 },
    { title:"Maestro", level: 3, color: '#d9c764', amount: 200 },];
    answerLevel: StatLevel[] = [{ level: 0, title:"Novato", color: '#525252', amount: 0 }, { level: 1, title:"Iniciado", color: '#916323', amount: 5 }, { level: 2, title:"Avanzado", color: '#a9b8b7', amount: 20 },
    { title:"Maestro",level: 3, color: '#d9c764', amount: 50 }];
    acceptedLevel: StatLevel[] = [{ level: 0, title:"Novato", color: '#525252', amount: 0 }, { level: 1, title:"Iniciado", color: '#916323', amount: 1 }, { level: 2, title:"Avanzado", color: '#a9b8b7', amount: 10 },
    { title:"Maestro", level: 3, color: '#d9c764', amount: 5 }];

    constructor(private http: HttpClient) {

    }

    getMyStats() {
        return this.http.get<UserStats>(environment.apiUrl + "/api/stats/me");
    }

    getQuestionsLevel(amount: number) {
        return this.getLevel(amount, this.questionLevel);
    }

    getAnswerLevel(amount: number) {
        return this.getLevel(amount, this.answerLevel);
    }

    getAcceptedLevel(amount: number) {
        return this.getLevel(amount, this.acceptedLevel);
    }

    getLevel(amount: number, arr: StatLevel[]): StatLevelResult {
        let curLevel: StatLevel = null;
        let i;
        for (i = 0; i < arr.length; i++) {
            if (amount >= arr[i].amount)
                curLevel = arr[i];
            else
                break;
        }
        return { level: curLevel, nextAmount: i < arr.length ? arr[i].amount - curLevel.amount : 0}

    }

}