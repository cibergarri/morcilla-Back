import { Component, Input } from '@angular/core';

@Component({
    selector: 'validation-errors',
    templateUrl: './validation-errors.component.html',
    styleUrls: ['./validation-errors.component.scss']
})
/** validation-errors component*/
export class ValidationErrorsComponent {
    /** validation-errors ctor */

  @Input() control: any;

    constructor() {

    }


}
