import { Component } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(private authComponent: AuthComponent, private fb: FormBuilder){}

  login(){
    this.authComponent.login(
      this.form.value.username,
      this.form.value.password
    );
  }
}
