import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Isubcategories } from 'src/app/interface/isubcategories';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

	constructor(private http:HttpClient) { }

	/*=============================================
	Tomar data filtrada de la colección subcategorías en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	/*=============================================
	Tomar la data de la colección categorías en Firebase
	=============================================*/

	getData(){

		return this.http.get(`${environment.urlFirebase}sub-categories.json`);
	}

	/*=============================================
	Guardar información de la categoría
	=============================================*/

	postData(data: Isubcategories){

		return this.http.post(`${environment.urlFirebase}sub-categories.json`, data);

	}

	/*=============================================
	Tomar un item de la data colección subcategorías en Firebase
	=============================================*/

	getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}sub-categories/${id}.json`);
		
	}

	/*=============================================
	Actualizar información 
	=============================================*/

	patchData(id:string, data:object){

		return this.http.patch(`${environment.urlFirebase}sub-categories/${id}.json`, data);

	}

	/*=============================================
	Eliminar Subcategoría
	=============================================*/

	deleteData(id:string){

		return this.http.delete(`${environment.urlFirebase}sub-categories/${id}.json`);

	}

}
