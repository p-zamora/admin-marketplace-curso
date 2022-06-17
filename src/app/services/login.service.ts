import { Injectable } from '@angular/core';
import { Ilogin } from 'src/app/interface/ilogin';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

	constructor(private http: HttpClient) { }

	/*=============================================
	LOGIN en Firebase Authentication
	=============================================*/

	login(data: Ilogin){

		return this.http.post(environment.urlLogin, data).pipe(
			map((resp:any)=>{

				/*=============================================
				Capturamos el idToken y refreshToken
				=============================================*/
				
				localStorage.setItem('token', resp.idToken);
				localStorage.setItem('refreshToken', resp.refreshToken);

			})

		);
	}

}
