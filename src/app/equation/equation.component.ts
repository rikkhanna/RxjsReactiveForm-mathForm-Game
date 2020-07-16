import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl} from '@angular/forms';
import { MathValidators } from '../math-validators';
import { delay,filter, scan } from 'rxjs/operators';
@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {

  secondsPerSolution = 0;
  mathForm = new FormGroup(
    {
      a : new FormControl(this.randomNum()),
      b : new FormControl(this.randomNum()),
      answer: new FormControl('')
    },
    [
      MathValidators.addition('answer','a','b')
    ]
  );

  get a(){
    return this.mathForm.value.a;
  }
  get b(){
    return this.mathForm.value.b;
  }

  constructor() { }

  randomNum(){
    return Math.floor(Math.random() * 10);
  }
  ngOnInit(): void {
    this.mathForm.statusChanges
    .pipe(
      filter(value => value === 'VALID'),
      delay(100),
      scan(
        acc => {
          return { numberOfSolved: acc.numberOfSolved + 1, startTime: acc.startTime }
        },
        { numberOfSolved: 0, startTime: new Date()}
      )
    )
    .subscribe(({startTime, numberOfSolved}) => {
      this.secondsPerSolution = (new Date().getTime() - startTime.getTime())/numberOfSolved / 1000;
      this.mathForm.setValue({
        a: this.randomNum(),
        b: this.randomNum(),
        answer: ''
      })
    })
  }

}
