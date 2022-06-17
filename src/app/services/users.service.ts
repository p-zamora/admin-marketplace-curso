import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

	constructor(private http:HttpClient ) { }

	/*=============================================
	Tomar la data de la colección usuarios en Firebase
	=============================================*/

	getData(){

		return this.http.get(`${environment.urlFirebase}users.json`);
	}

	/*=============================================
	Tomar data filtrada de la colección categorías en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}users.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

}
