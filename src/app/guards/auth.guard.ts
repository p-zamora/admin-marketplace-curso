import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	
	constructor(private router: Router, private http: HttpClient ){}

	canActivate(): Promise<boolean>{
    
    	return new Promise(resolve =>{

    		/*=============================================
			Validamos que el token si exista
			=============================================*/

			if(localStorage.getItem('token') != null){

				/*=============================================
				Validamos que el token si sea real
				=============================================*/

				let body = {

					idToken: localStorage.getItem('token')
				}

				this.http.post(environment.urlGetUser, body).subscribe(

					resp=>{

						resolve(true);
					
					},
					err=>{

					    localStorage.removeItem('token');
						localStorage.removeItem('refreshToken');
						this.router.navigateByUrl("/login");
						resolve(false);

					}

				)				

			}else{

				this.router.navigateByUrl("/login");
				resolve(false);
			
			}


    	})
  
  	}
  
}
