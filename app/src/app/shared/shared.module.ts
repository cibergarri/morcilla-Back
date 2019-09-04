import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationErrorsComponent } from './validation-errors/validation-errors.component';

@NgModule({
   declarations: [
      HeaderBarComponent,
      ValidationErrorsComponent
   ],
   imports: [
      CommonModule,
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      NgbModule
   ],
   exports: [
      HeaderBarComponent,
      ValidationErrorsComponent
   ]
})
export class SharedModule { }
