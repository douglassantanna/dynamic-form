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
  isFamilyMembership = true;
  isTitle = false;
  selectedEvent = true;
  firstColumnControls: any[] = [];
  secondColumnControls: any[] = [];
  checkboxesColumnControls: any[] = [];
  titleRowColumnsControls: any[] = [];
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

  getControlClass(controlName: string): object {
    return {
      'col-md-4 mb-2': this.isControlTitle(controlName),
      'mb-2': !this.isControlTitle(controlName)
    };
  }

  preventSpacing(event: any, control: any) {
    if (!control.name.toLocaleLowerCase().includes("address")) {
      event.preventDefault();
    }
  }

  private isControlTitle(controlName: string): boolean {
    return controlName === 'title';
  }
  private generateForm() {
    const formGroup: any = {};

    this.filteredControls = this.controls.filter((control:any) => control.enabled);

    this.isTitle = this.filteredControls.some((control: any) => control.name === 'title');

    if (this.isMembeship || this.selectedEvent) {
      this.filteredControls = this.filteredControls.filter((control: any) => control.name !== 'home');
    }

    if(!this.isFamilyMembership){
      this.filteredControls = this.filteredControls.filter((control:any) => !control.name.includes('second'))
      this.firstColumnControls = this.filteredControls.filter((control:any) => !control.name.includes('second'))
    }

    if(this.isFamilyMembership){
      this.secondColumnControls = this.filteredControls.filter((control:any) => control.name.includes('second') && control.type != 'checkbox')
      this.firstColumnControls = this.filteredControls.filter((control:any) => !control.name.includes('second') && control.type != 'checkbox')
    }

    this.checkboxesColumnControls = this.filteredControls.filter((control:any)=> control.type == 'checkbox')
    if(this.checkboxesColumnControls){
      this.firstColumnControls = this.filteredControls.filter((control:any) => !control.name.includes('second') && control.type != 'checkbox')
    }

    if (this.isTitle) {
      this.titleRowColumnsControls = this.filteredControls.filter((control: any) =>
      ['title', 'firstName', 'surName'].includes(control.name)
      );

      const excludedControlNames = ['title', 'firstName', 'surName'];

      this.firstColumnControls = this.filteredControls.filter((control: any) =>
      !excludedControlNames.includes(control.name)
      );

      this.firstColumnControls = this.firstColumnControls.filter((control:any) => control.type != 'checkbox')
    }

    for (let field of this.filteredControls) {
      formGroup[field.name] = [field.value, [
        field.validators.required ? Validators.required : Validators.nullValidator,
        field.name === 'email' ? Validators.email : Validators.nullValidator]
      ];
    }

    this.dynamicForm = this.fb.group(formGroup);

    if (this.dynamicForm.get('confirmemail')) {
      this.dynamicForm.get('confirmemail')?.setValidators([createConfirmEmailValidator(this.dynamicForm), Validators.required]);
    }

    console.log(this.dynamicForm.value)
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
