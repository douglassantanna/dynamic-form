import { Component, OnInit } from '@angular/core';
import { ControlService } from './control.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function createConfirmEmailValidator(): ValidatorFn {
  return (formGroup:AbstractControl) : ValidationErrors | null => {

    let email = formGroup.get('email')?.value;
    let confirmEmail = formGroup.get('confirmemail')?.value;
    if(email !== confirmEmail){
      return {emailMatch:true}
    }
    return null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'dynamic-forms-poc';

  dynamicForm: FormGroup = {} as FormGroup;

  controls: any = {};

  constructor(
    private controlService:ControlService, 
    private fb:FormBuilder
    ){}
 
  
  private getControls(){
    this.controlService.getControls().subscribe((value)=>{
      this.controls = value.controls;

      this.generateForm()
    });
  }

  ngOnInit(): void {
    this.getControls();
  }

  private generateForm() {
    const formGroup: any = {};

    for(let field of this.controls){
      if(field.enabled){
        formGroup[field.name] = [field.value, [
          field.validators.required ? Validators.required : Validators.nullValidator, 
          field.name == 'email' ? Validators.email : Validators.nullValidator,
          field.name == 'confirmemail' ? Validators.pattern : Validators.nullValidator]];
      }
    }
    this.dynamicForm = this.fb.group(formGroup)
  }

  onSubmit(){
    console.log(this.dynamicForm.value)
  }

  setCheckboxValue(field:any, event:any){
    this.dynamicForm.get(field)?.setValue(event.target.checked);
  }
}
