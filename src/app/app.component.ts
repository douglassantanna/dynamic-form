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
  title = 'Enter your details';
  dynamicForm: FormGroup = {} as FormGroup;
  controls: any[] = [];
  filteredControls: any[] = [];
  isMembeship = true;
  isFamilyMembership = false;
  selectedEvent = true;
  firstColumnControls: any[] = [];
  secondColumnControls: any[] = [];

  constructor(
    private controlService:ControlService,
    private fb:FormBuilder
    ){this.dynamicForm = this.fb.group({})}

  ngOnInit(): void {
    this.getControls();
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

    if(!this.isFamilyMembership){
      this.filteredControls = this.filteredControls.filter((control:any) => !control.name.includes('second'))
      this.firstColumnControls = this.filteredControls.filter((control:any) => !control.name.includes('second'))
    }

    if(this.isFamilyMembership){
      this.secondColumnControls = this.filteredControls.filter((control:any) => control.name.includes('second'))
      this.firstColumnControls = this.filteredControls.filter((control:any) => !control.name.includes('second'))
    }

    for (let field of this.filteredControls) {
      if (field.enabled) {
        formGroup[field.name] = [field.value, [
          field.validators.required ? Validators.required : Validators.nullValidator,
          field.name === 'email' ? Validators.email : Validators.nullValidator]
        ];
      }
    }

    this.dynamicForm = this.fb.group(formGroup);

    if (this.dynamicForm.get('confirmemail')) {
      this.dynamicForm.get('confirmemail')?.setValidators([createConfirmEmailValidator(this.dynamicForm), Validators.required]);
    }
  }
  private getControls(){
    this.controlService.getControls().subscribe({
      next:(value)=> {
        this.controls = value.controls;
        this.generateForm();
      },
      error:(err)=> {
        console.log(err);
      },
    });
  }
  onSubmit(){
    console.log(this.dynamicForm.value)
  }
}
