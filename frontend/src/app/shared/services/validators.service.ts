import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ValidatorsService {
  constructor() {}

  caseValidator(control: AbstractControl): { [key: string]: any } | null {
    const value: string = control.value;
    if (value && (!/[a-z]/.test(value) || !/[A-Z]/.test(value))) {
      return { caseRequirement: { value } };
    }
    return null;
  }

  numberValidator(control: AbstractControl): { [key: string]: any } | null {
    const value: string = control.value;
    if (value && !/\d/.test(value)) {
      return { numberRequirement: { value } };
    }
    return null;
  }

  specialCharacterValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const value: string = control.value;
    const specialChars = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value && !specialChars.test(value)) {
      return { specialCharRequirement: { value } };
    }
    return null;
  }

  customEmailValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const value: string = control.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (value && !emailPattern.test(control.value)) {
      return { invalidEmail: { value } };
    }
    return null;
  }

  phoneNumberValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const value: string = control.value;
    const phonePattern = /^\d{9}$/;

    if (value && !phonePattern.test(control.value)) {
      return { invalidPhoneNumber: { value } };
    }
    return null;
  }
}
