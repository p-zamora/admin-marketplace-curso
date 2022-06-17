import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisputesService {

  disputes:number = 0;

  constructor(private http:HttpClient ) { }  

  /*=============================================
  Tomar la data de la colección disputas en Firebase
  =============================================*/

  getData(){

    return this.http.get(`${environment.urlFirebase}disputes.json`);
  } 

   /*=============================================
  Tomar un item de la data colección disputas en Firebase
  =============================================*/

  getItem(id: string) {

    return this.http.get(`${environment.urlFirebase}disputes/${id}.json`);
    
  } 

  /*=============================================
  Actualizar información 
  =============================================*/

  patchData(id:string, data:object){

    return this.http.patch(`${environment.urlFirebase}disputes/${id}.json`, data);

  }

  /*=============================================
  Tomar data filtrada de la colección mensajes en Firebase
  =============================================*/

  getFilterData(orderBy:string, equalTo:string){

    return this.http.get(`${environment.urlFirebase}disputes.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`).pipe(
      map((resp:any)=>{

        this.disputes = 0;

        Object.keys(resp).map( (a) => {

          if(resp[a].answer == undefined){

            this.disputes++

          }
      
        });

        return resp;

      })

    );

  }
}
