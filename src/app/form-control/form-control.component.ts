import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styles: [
  ]
})
export class FormControlComponent {
  @Input() control: any;
  @Input() dynamicForm: FormGroup = {} as FormGroup;
  constructor() { }

  setCheckboxValue(field:any, event:any){
    this.dynamicForm.get(field)?.setValue(event.target.checked);
  }

  getControlClass(controlName: string): object {
    return {
      'col-md-6 mb-2': this.isControlTitle(controlName),
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
}
