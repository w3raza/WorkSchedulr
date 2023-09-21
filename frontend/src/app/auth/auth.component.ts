import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';

import { LoginResponse } from '../shared/models/loginResponse.model';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

	form = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
	  });

	  login(){
		const username = this.form.value.username;
		const password = this.form.value.password;
		this.authService.loginUser(
			username,
			password
		).subscribe({
			next: (response: LoginResponse) => {
				this.authService.setAuthToken(response.token);
				this.router.navigateByUrl("/home");
			},
			error: (error) => {
				this.authService.setAuthToken(null);
				alert(error.message);
			}
		})
	  }
}