import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Iproducts } from 'src/app/interface/iproducts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

	constructor(private http:HttpClient) { }

	/*=============================================
	Tomar la data de la colección productos en Firebase
	=============================================*/

	getData(){

		return this.http.get(`${environment.urlFirebase}products.json`);
	}

	/*=============================================
	Tomar data filtrada de la colección productos en Firebase
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${environment.urlFirebase}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	/*=============================================
	Tomar un item de la data colección categorías en Firebase
	=============================================*/

	getItem(id: string) {

		return this.http.get(`${environment.urlFirebase}products/${id}.json`);
		
	}

	/*=============================================
	Actualizar información 
	=============================================*/

	patchData(id:string, data:object){

		return this.http.patch(`${environment.urlFirebase}products/${id}.json`, data);

	}

	/*=============================================
	Guardar información del producto
	=============================================*/

	postData(data: Iproducts){

		return this.http.post(`${environment.urlFirebase}products.json`, data);

	}

	 /*=============================================
	Eliminar producto
	=============================================*/

	deleteData(id:string){

		return this.http.delete(`${environment.urlFirebase}products/${id}.json`);

	}

	/*=============================================
  Tomar rangos limitados
  =============================================*/
 
  getLatestData(){

     return this.http.get(`${environment.urlFirebase}products.json?orderBy="date_created"&limitToLast=5&print=pretty`);

  }



}
