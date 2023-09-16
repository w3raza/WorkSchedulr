import { Component } from '@angular/core';
import { AxiosService } from '../axios.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    constructor(private axiosService: AxiosService) { }

    login(username: string, password: string){
        this.axiosService.request(
		    "POST",
		    "users/signin",
		    {
		        username: username,
		        password: password
		    }).then(
		    response => {
		        this.axiosService.setAuthToken(response.data.token);
		    }).catch(
		    error => {
		        this.axiosService.setAuthToken(null);
                alert("Error");
		    }
		);
    }

}