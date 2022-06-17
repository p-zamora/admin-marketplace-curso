import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

   constructor(private http:HttpClient ) { } 

  /*=============================================
  Tomar la data de la colección órdenes en Firebase
  =============================================*/

  getData(){ 

     return this.http.get(`${environment.urlFirebase}orders.json`);

  }

  /*=============================================
   Tomar un item de la data colección categorías en Firebase
   =============================================*/

   getItem(id: string) {

      return this.http.get(`${environment.urlFirebase}orders/${id}.json`);
      
   }

   /*=============================================
   Actualizar información 
   =============================================*/

   patchData(id:string, data:object){

      return this.http.patch(`${environment.urlFirebase}orders/${id}.json`, data);

   }



}
