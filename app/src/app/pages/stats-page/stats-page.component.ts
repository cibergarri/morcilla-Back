import { StatLevelResult, StatTimeTotal } from './../../models/models-classes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserStats } from 'src/app/models/models-classes';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent implements OnInit {

  stats: UserStats;
  questionLevel: StatLevelResult;
  answerLevel: StatLevelResult;
  acceptedLevel: StatLevelResult;
 projects: StatTimeTotal[] = []; 

  constructor(route: ActivatedRoute, public statsService: StatsService) {
    this.stats = route.snapshot.data.stats;
    this.questionLevel = statsService.getQuestionsLevel(this.stats.questions);
    this.answerLevel = statsService.getAnswerLevel(this.stats.answers.total);
    this.acceptedLevel = statsService.getAcceptedLevel(this.stats.answers.accepted);
    this.projects = Object.keys(this.stats.workingHours.totalsByProject).map((key) => {
      let obj = this.stats.workingHours.totalsByProject[key];
      console.log(obj);
      return { hours: obj.total.hours, minutes:obj.total.minutes, name: key };
    });
  }

  ngOnInit() {
  }

  getTotalWorkingMinutes(){
    return this.stats.workingHours.total.hours * 60 + this.stats.workingHours.total.minutes; 
  }

  toMinutes(proj: StatTimeTotal){
    return proj.hours * 60 + proj.minutes;
  }

}
