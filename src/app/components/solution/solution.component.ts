import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SolutionModel} from "../../models/solutionModel";

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SolutionComponent implements OnInit {
  @Input() solutionModel: SolutionModel;
  @Output() edit: EventEmitter<number> = new EventEmitter<number>()

  constructor() {
  }

  ngOnInit(): void {
  }

}
