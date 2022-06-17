import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DisputesService } from 'src/app/services/disputes.service';
import { Idisputes } from 'src/app/interface/idisputes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from 'src/app/services/orders.service';


export interface IDialogData{
  id:string;
}

@Component({
  selector: 'app-edit-disputes',
  templateUrl: './edit-disputes.component.html',
  styleUrls: ['./edit-disputes.component.css']
})
export class EditDisputesComponent implements OnInit {

  /*=============================================
  Creamos grupo de controles
  =============================================*/

  public f = this.form.group({

    answer:['', [Validators.required,  Validators.pattern('[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]]
  
  });

  /*=============================================
  Validación personalizada en la vista HTML
  =============================================*/

  get answer() { return this.f.controls.answer }

  /*=============================================
  Visualizar el mensaje
  =============================================*/

  message = "";

  /*=============================================
  Datos del comprador y de la orden
  =============================================*/

  dataUser = "";
  dataEmail = "";
  dataOrder = "";

  /*=============================================
  Variable que valida el envío del formulario
  =============================================*/

  formSubmitted = false;

  /*=============================================
  Variable para precarga
  =============================================*/

  loadData = false;

  constructor(private form: FormBuilder, 
        private disputesService: DisputesService,
        private ordersService: OrdersService, 
        private http:HttpClient, 
        public dialogRef: MatDialogRef<EditDisputesComponent>,  
        @Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

  ngOnInit(): void {

    this.disputesService.getItem(this.data.id)
    .subscribe(

      (resp:any)=>{

        this.message = resp.message;

        this.answer.setValue(resp.answer);

        this.dataOrder = resp.order;

        this.ordersService.getItem(resp.order)
        .subscribe(

          (resp:any)=>{

            this.dataUser = resp.user;
            this.dataEmail = resp.email;

          }

        )

      }

    )

  }

  /*=============================================
  Función Save Store
  =============================================*/

  editDispute(){

    /*=============================================
    Validamos que el formulario haya sido enviado
    =============================================*/

    this.formSubmitted = true;

    /*=============================================
    Validamos que el formulario esté correcto
    =============================================*/

    if(this.f.invalid){
            
      return;
    }

    /*=============================================
    Creamos el cuerpo 
    =============================================*/

    let dataDispute = {

      "answer":this.f.controls.answer.value,
      "date_answer": new Date()
    }

    /*=============================================
    Guardar en base de datos la info de la tienda
    =============================================*/

    this.disputesService.patchData(this.data.id, dataDispute).subscribe(

      resp=>{

        /*=============================================
        Enviar notificación al que generó la disputa por correo electrónico
        =============================================*/

        const formData = new FormData();

        formData.append('email','yes');
        formData.append('comment', `The dispute generated in the order ${this.dataOrder} has been answered`  );
        formData.append('url',`${environment.domainMP}account/my-shopping`);
        formData.append('address', this.dataEmail);
        formData.append('name', this.dataUser);

        this.http.post(environment.urlEmail, formData)
        .subscribe(

          (resp:any) =>{
                  
            if(resp["status"] == 200){

              this.loadData = false;

              this.dialogRef.close('save');

              

              alerts.basicAlert("Ok", 'The dispute has been saved', "success") 

            }  

          })   

      },

      err =>{

        this.loadData = false;

        alerts.basicAlert("Error", 'Dispute saving error', "error")

      }

    )

  }

  /*=============================================
  Validamos formulario
  =============================================*/

  invalidField(field:string){

    return functions.invalidField(field, this.f, this.formSubmitted);
    
  }



}
