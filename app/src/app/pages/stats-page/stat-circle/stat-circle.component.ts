import { StatLevelResult } from './../../../models/models-classes';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat-circle',
  templateUrl: './stat-circle.component.html',
  styleUrls: ['./stat-circle.component.scss']
})
export class StatCircleComponent implements OnInit {

@Input() amount: number;
@Input() level: StatLevelResult;

  constructor() { }

  ngOnInit() {
  }

  
  getPercentage(){
    const pctg = this.level.nextAmount ? (this.amount / this.level.nextAmount) * 100 : 100;
    return pctg;
  }
  


}
