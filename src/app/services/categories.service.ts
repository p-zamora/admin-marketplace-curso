import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Icategories } from 'src/app/interface/icategories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

	constructor(private http:HttpClient ) { }

	/*=============================================
	Tomar la data de la colección categorías en Firebase
	=============================================*/

	getData(){

		return this.http.get(`${environment.urlFirebase}categories.json`);
	}

	/*=============================================
	Tomar data filtrada de la colección categorías en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	/*=============================================
	Guardar información de la categoría
	=============================================*/

	postData(data: Icategories){

		return this.http.post(`${environment.urlFirebase}categories.json`, data);

	}

	/*=============================================
	Actualizar información 
	=============================================*/

	patchData(id:string, data:object){

		return this.http.patch(`${environment.urlFirebase}categories/${id}.json`, data);

	}

	/*=============================================
	Tomar un item de la data colección categorías en Firebase
	=============================================*/

	getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}categories/${id}.json`);
		
	}

	 /*=============================================
	Eliminar categoría
	=============================================*/

	deleteData(id:string){

		return this.http.delete(`${environment.urlFirebase}categories/${id}.json`);

	}

}
