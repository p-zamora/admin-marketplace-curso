import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessagesService } from 'src/app/services/messages.service';
import { Imessages } from 'src/app/interface/imessages';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/services/users.service';

export interface IDialogData{
  id:string;
}

@Component({
  selector: 'app-edit-messages',
  templateUrl: './edit-messages.component.html',
  styleUrls: ['./edit-messages.component.css']
})
export class EditMessagesComponent implements OnInit {

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
  Datos del comprador y del producto
  =============================================*/

  dataUser = "";
  dataEmail = "";
  dataProduct = "";

  /*=============================================
  Variable que valida el envío del formulario
  =============================================*/

  formSubmitted = false;

  /*=============================================
  Variable para precarga
  =============================================*/

  loadData = false;

  constructor(private form: FormBuilder, 
        private messagesService: MessagesService,
        private usersService: UsersService, 
        private http:HttpClient, 
        public dialogRef: MatDialogRef<EditMessagesComponent>,  
        @Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

  ngOnInit(): void {

    this.messagesService.getItem(this.data.id)
    .subscribe(

      (resp:any)=>{

        this.message = resp.message;

        this.answer.setValue(resp.answer);

        this.dataProduct = resp.url_product;
        this.dataUser = resp.transmitter;

        this.usersService.getFilterData("username",resp.transmitter)
        .subscribe(

          (resp:any)=>{
           
            Object.keys(resp).map(a=> {

              this.dataEmail = resp[a].email;

            })

          }

        )

      }

    )

  }

  /*=============================================
  Función Save Message
  =============================================*/

  editMessage(){

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

    let dataMessage = {

      "answer":this.f.controls.answer.value,
      "date_answer": new Date()
    }

    console.log("dataMessage", dataMessage);

    /*=============================================
    Guardar en base de datos la info de la tienda
    =============================================*/

    this.messagesService.patchData(this.data.id, dataMessage).subscribe(

      resp=>{

        /*=============================================
        Enviar notificación al que escribió el mensaje por correo electrónico
        =============================================*/

        const formData = new FormData();

        formData.append('email','yes');
        formData.append('comment', `The message made on the product ${this.dataProduct} has been answered`  );
        formData.append('url',`${environment.domainMP}product/${this.dataProduct}`);
        formData.append('address', this.dataEmail);
        formData.append('name', this.dataUser);

        this.http.post(environment.urlEmail, formData)
        .subscribe(

          (resp:any) =>{   

            if(resp["status"] == 200){ 
             
              this.loadData = false;

              this.dialogRef.close('save');

              alerts.basicAlert("Ok", 'The message has been saved', "success") 

            }  

          })   

      },

      err =>{

        this.loadData = false;

        alerts.basicAlert("Error", 'Message saving error', "error")

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
