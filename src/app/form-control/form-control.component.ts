import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styles: [`
  .small {
    background-color: red;
    }
  `
  ]
})
export class FormControlComponent {
  @Input() isTitle= false;
  @Input() control: any;
  @Input() dynamicForm: FormGroup = {} as FormGroup;
  constructor() { }

  setCheckboxValue(field:any, event:any){
    this.dynamicForm.get(field)?.setValue(event.target.checked);
  }

  getControlClass(): object {
    return {
      'col-md-2': this.isTitle,
      'col': !this.isTitle,
    };
  }

  getControlNameClass(controlName:string) : object{
    return {
      'col': this.checkControlName(controlName),
      'col-6': this.checkControlName(controlName),
    }
  }

  checkControlName(controlName:string): boolean{
    if(controlName === 'surName' || controlName === 'firstName'){
      return true;
    }else {
      return false;
    }
  }

  preventSpacing(event: any, control: any) {
    if (!control.name.toLocaleLowerCase().includes("address")) {
      event.preventDefault();
    }
  }

  private isControlTitle(controlName: string): boolean {
    return controlName === 'title';
  }
}
