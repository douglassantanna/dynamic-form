import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Control {
  name: string
  label: string
  value: string
  type: string
  link: string
  enabled: boolean
  editable: boolean
  validators: Validators
  values?: string[]
}

export interface Validators {
  required?: boolean
  minLength?: number
  maxLength?: number
}

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private http: HttpClient) { }

  getControls(): Observable<any>{
    return this.http.get("assets/controls.json");
  }
}
