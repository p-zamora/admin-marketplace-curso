import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map  } from 'rxjs/operators'; 

@Injectable()
export class IntInterceptor implements HttpInterceptor {

  token:any = "";

	constructor(private http: HttpClient) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

     // no se agrega token a las peticones de login ni de refrescar el token
    if(request.url == environment.urlLogin || request.url == environment.urlRefreshToken){

       return next.handle(request);
    
    }

		//se obtiene el token del local storage
    this.token =  localStorage.getItem('token');

    //Capturamos la fecha de expiración en formato epoch
    const payload:any = JSON.parse(atob(this.token.split(".")[1])).exp;

    //Cambiamos el formato epoch por el formato tradicional de fecha
		const tokenExp:any = new Date(payload * 1000);

		//Capturamos el tiempo actual
    const now:any = new Date();
   
    //calculamos 15 minutos después del tiempo actual
    now.setTime(now.getTime() + (15 * 60 * 1000));
   
    //Validamos si el token está próximo a vencerse
    if(tokenExp.getTime() < now.getTime()){

      const body = {

        'grant_type': 'refresh_token',
        'refresh_token': localStorage.getItem('refreshToken')
      }

      this.http.post(environment.urlRefreshToken, body)
      .subscribe(

        (resp:any)=>{
          
          localStorage.setItem('token', resp.id_token);
          localStorage.setItem('refreshToken', resp.refresh_token);

          this.token = resp.id_token;
        }

      )

    }

		return next.handle(this.cloneToken(request, this.token)).pipe(

        map((resp:any)=>{

          return resp;
        
        })
    
    );

	}

  /*=============================================
  Clonar el parámetro Token 
  =============================================*/

  cloneToken(request: HttpRequest<unknown>, token:string): HttpRequest<any>{

    return request.clone({

      setParams:{

        auth: token
      
      }

    })

  }

}
