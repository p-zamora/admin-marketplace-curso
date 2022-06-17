import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/services/orders.service';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SalesService } from 'src/app/services/sales.service';

export interface IDialogData{
  id:string;
}

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.css']
})
export class EditOrdersComponent implements OnInit {

  /*=============================================
  Creamos grupo de controles
  =============================================*/

  public f = this.form.group({

    process:[]

  })

  /*=============================================
  Validación personalizada en la vista HTML
  =============================================*/

  get process() { return this.f.controls.process }


  /*=============================================
  Visualizar el proceso de la orden
  =============================================*/

  processOrder:any[] = [];

  newNextProcess:any[] = [
    {"stage":"","status":"","comment":"","date":""},
    {"stage":"","status":"","comment":"","date":""},
    {"stage":"","status":"","comment":"","date":""}
  ];

  /*=============================================
  Datos del comprador y del producto
  =============================================*/

  dataUser = "";
  dataEmail = "";
  dataProduct = "";


  /*=============================================
  Variable para precarga
  =============================================*/

  loadData = false;

  /*=============================================
  Variable que valida el envío del formulario
  =============================================*/

  formSubmitted = false;

  constructor(private form: FormBuilder,
              private ordersService: OrdersService,
              private salesService: SalesService,
              private http:HttpClient, 
              public dialogRef: MatDialogRef<EditOrdersComponent>,  
              @Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

  ngOnInit(): void {

    this.ordersService.getItem(this.data.id)
    .subscribe(

      (resp:any)=>{
        
         this.processOrder = JSON.parse(resp.process);

        /*=============================================
        Esconder la edición de entrega si el producto aún no se ha enviado
        =============================================*/  

        if(this.processOrder[1].status == "pending"){

           this.processOrder.splice(2,1);

        }

        this.process.setValue(JSON.parse(resp.process));

        this.dataUser = resp.user;
        this.dataEmail = resp.email;
        this.dataProduct = resp.product;
         
      }

    )


  }

  editOrder(){

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


    this.loadData = true;

    /*=============================================
    Agrupamos la información a subir a BD
    =============================================*/
    this.f.controls.process.value.map((item:any, index:any)=>{

      if(this.newNextProcess[index]["status"] != ""){

        item["status"] = this.newNextProcess[index]["status"];

      }

       if(this.newNextProcess[index]["comment"] != ""){

          item["comment"] = this.newNextProcess[index]["comment"];
      }
      
      if(this.newNextProcess[index]["date"] != ""){

          item["date"] = this.newNextProcess[index]["date"];

      }

      return item;


    })

     /*=============================================
    Preguntamos si es la última parte del proceso
    =============================================*/

    let status = "";

    if(this.newNextProcess[2]["status"] == "ok"){

      status = "delivered";

      /*=============================================
      Traemos la venta relacionada a la orden
      =============================================*/

      this.salesService.getFilterData("id_order", this.data.id)
      .subscribe(resp=>{

        let idSale = Object.keys(resp)[0];

        let body = {

          "status":"success"  
        
        }

        /*=============================================
        Cambiar el estado de la venta
        =============================================*/

        this.salesService.patchDataAuth(idSale, body, localStorage.getItem("token"))
        .subscribe(resp=>{ })

      })


    }else{

      status = "pending"; 

    }

    /*=============================================
    Creamos el cuerpo 
    =============================================*/

    let dataOrders = {

      "status": status,
      "process":JSON.stringify(this.f.controls.process.value)
    }

    /*=============================================
    Guardar en base de datos la info de la tienda
    =============================================*/

    this.ordersService.patchData(this.data.id, dataOrders).subscribe(

      resp=>{

        /*=============================================
        Enviar notificación al comprador por correo electrónico
        =============================================*/

        const formData = new FormData();

        formData.append('email','yes');
        formData.append('comment', `Your ${this.dataProduct} product has had an update on delivery`  );
        formData.append('url',`${environment.domainMP}account/my-shopping`);
        formData.append('address', this.dataEmail);
        formData.append('name', this.dataUser);

        this.http.post(environment.urlEmail, formData)
        .subscribe(

            (resp:any) =>{

               if(resp["status"] == 200){

                  this.loadData = false;

                  this.dialogRef.close('save');

                  alerts.basicAlert("Ok", 'The order has been saved', "success") 


               }

            }

        )


      },

      err =>{


          this.loadData = false;

          alerts.basicAlert("Error", 'Order saving error', "error")

      }


    )


  }

   /*=============================================
  Recoger información al cambiar el proceso
  =============================================*/

  changeProcess(type:any, item:any, index:any){
    
    this.newNextProcess[index][type] = item.value;

  }

}
