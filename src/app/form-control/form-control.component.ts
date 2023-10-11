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
  @Input() index: number = 0;
  @Input() dynamicForm: FormGroup = {} as FormGroup;
  constructor() { }

  setCheckboxValue(field:any, event:any){
    this.dynamicForm.get(field)?.setValue(event.target.checked);
  }
}
