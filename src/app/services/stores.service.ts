import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

	constructor(private http:HttpClient ) { }

	/*=============================================
	Tomar la data de la colección categorías en Firebase
	=============================================*/

	getData(){

		return this.http.get(`${environment.urlFirebase}stores.json`);
	}

	/*=============================================
	Tomar un item de la data colección categorías en Firebase
	=============================================*/

	getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}stores/${id}.json`);
		
	}

	/*=============================================
	Actualizar información 
	=============================================*/

	patchData(id:string, data:object){

		return this.http.patch(`${environment.urlFirebase}stores/${id}.json`, data);

	}

	/*=============================================
	Tomar data filtrada de la colección categorías en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}stores.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}



}
