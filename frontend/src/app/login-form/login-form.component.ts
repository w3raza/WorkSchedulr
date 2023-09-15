import { EventEmitter, Component, Output } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  })
export class LoginFormComponent {

  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  countries: string[] = [
    'Albania', 'Austria', 'Belgia', 'Białoruś', 'Bośnia i Hercegowina', 'Bułgaria', 'Chorwacja', 'Czarnogóra', 'Czechy', 'Dania', 'Estonia', 'Finlandia', 'Francja', 'Grecja', 'Hiszpania', 'Holandia', 'Irlandia', 'Islandia', 'Litwa', 'Luksemburg', 'Łotwa', 'Macedonia Północna', 'Mołdawia', 'Niemcy', 'Norwegia', 'Polska', 'Portugalia', 'Rosja', 'Rumunia', 'Serbia', 'Słowacja', 'Słowenia', 'Szwajcaria', 'Szwecja', 'Ukraina', 'Węgry', 'Wielka Brytania', 'Włochy'
  ];
	active: string = "login";
  username: string = '';
  password: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  selectedCountry: string | null = null;
  birth: Date | null = null;

	onLoginTab(): void {
		this.active = "login";
	}

	onRegisterTab(): void {
		this.active = "register";
	}

  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({"username": this.username, "password": this.password});
  }

  onSubmitRegister(): void {
    this.onSubmitRegisterEvent.emit({
      username: this.username,
      password: this.password,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      country: this.selectedCountry,
      birth: this.birth
    });
  }
}
