import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { ControlService } from './control.service';

export function createConfirmEmailValidator(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value === formGroup.get('email')?.value
          ? null : {emailMismatch: true};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'dynamic-forms-poc';

  dynamicForm: FormGroup = {} as FormGroup;

  controls: any[] = [];
  filteredControls: any[] = [];

  isMembeship = true;
  selectedEvent = true;

  constructor(
    private controlService:ControlService,
    private fb:FormBuilder
    ){}

  ngOnInit(): void {
    this.getControls();
  }

  onSubmit(){
    console.log(this.dynamicForm.value)
  }

  setCheckboxValue(field:any, event:any){
    this.dynamicForm.get(field)?.setValue(event.target.checked);
  }

  private generateForm() {
    const formGroup: any = {};
    this.filteredControls = this.controls;

    if (this.isMembeship || this.selectedEvent) {
      this.filteredControls = this.filteredControls.filter((control: any) => control.name !== 'home');
    }

    for (let field of this.filteredControls) {
      if (field.enabled) {
        formGroup[field.name] = [field.value, [
          field.validators.required ? Validators.required : Validators.nullValidator,
          field.name === 'email' ? Validators.email : Validators.nullValidator
        ]];
      }
    }

    this.dynamicForm = this.fb.group(formGroup);

    if (this.dynamicForm.get('confirmemail')) {
      this.dynamicForm.get('confirmemail')?.setValidators([createConfirmEmailValidator(this.dynamicForm), Validators.required]);
    }
  }

  private getControls(){
    this.controlService.getControls().subscribe((value)=>{
      this.controls = value.controls;

      this.generateForm()
    });
  }
}
