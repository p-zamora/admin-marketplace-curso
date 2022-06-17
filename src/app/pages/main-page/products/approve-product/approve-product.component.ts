import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { StoresService } from 'src/app/services/stores.service';
import { Subject } from 'rxjs';

export interface IDialogData{
	id:string;
}

@Component({
  selector: 'app-approve-product',
  templateUrl: './approve-product.component.html',
  styleUrls: ['./approve-product.component.css']
})
export class ApproveProductComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		comment:['', [Validators.required,  Validators.pattern('[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]]
		
	})

	/*=============================================
	Validación personalizada en la vista
	=============================================*/

	get comment() { return this.f.controls.comment }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;

	/*=============================================
	Variable global para almacenar la información del correo
	=============================================*/

	dataEmail = {
		comment:'',
		url:'',
		address:'',
		nameStore:'',
		nameProduct:''
	}

	/*=============================================
	Variable para definir si el producto está aprovado o no
	=============================================*/

	visible = false;

  	constructor(private form: FormBuilder,
  				private productsService: ProductsService,
  				private http:HttpClient, 
  				private storesService: StoresService,
  				public dialogRef: MatDialogRef<ApproveProductComponent>,
  				@Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

  	ngOnInit(): void {

  		this.productsService.getItem(this.data.id)
  		.subscribe(

  			(resp1:any)=>{

  				if(JSON.parse(resp1.feedback).type == "approved"){

  					this.visible = true;

  				}
  				
  				this.comment.setValue(JSON.parse(resp1.feedback).comment);

  				/*=============================================
				Traer información de la tienda
				=============================================*/
				
				this.storesService.getFilterData("store", resp1.store)
				.subscribe(

					(resp2:any)=>{

						Object.keys(resp2).map(a=>{
							
							this.dataEmail.address = resp2[a].email;
							this.dataEmail.nameStore = resp2[a].store;
							this.dataEmail.url = resp1.url;
							this.dataEmail.nameProduct = resp1.name;

						})
			

					}

				)

  			}
  		)
  	}

  	/*=============================================
	Función Actualizar el producto
	=============================================*/

	approveProduct(){

		this.loadData = true;

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
		Actualizar estado del producto
		=============================================*/

		let feedback;

		if(this.visible){

			this.dataEmail.comment = `Your product ${this.dataEmail.nameProduct} has been approved`;

			feedback = {

				type:"approved",
				comment: this.f.controls.comment.value
			}
		
		}else{

			this.dataEmail.comment =  `Your product ${this.dataEmail.nameProduct} entered a review phase`;

			feedback = {

				type:"review",
				comment: this.f.controls.comment.value
			}
		}

		let data = {

			'feedback': JSON.stringify(feedback)

		}

		this.productsService.patchData(this.data.id, data)
		.subscribe(

			resp=>{

				/*=============================================
				Enviar notificación a la tienda por correo electrónico
				=============================================*/

				const formData = new FormData();

				formData.append('email','yes');
				formData.append('comment',this.dataEmail.comment );
				formData.append('url',`${environment.domainMP}product/${this.dataEmail.url}`);
				formData.append('address', this.dataEmail.address);
				formData.append('name', this.dataEmail.nameStore );

				this.http.post(environment.urlEmail, formData)
				.subscribe(

					(resp:any) =>{
	                
		                if(resp["status"] == 200){

		                	this.loadData = false;

							this.dialogRef.close('save');

							alerts.basicAlert("Ok", 'The product has been saved', "success")	


		                }else{

		                	alerts.basicAlert("Error", 'Error sending email notification', "error")

		                }

		            }

			 	)
				
			},

			err =>{

				this.loadData = false;

				alerts.basicAlert("Error", 'Product saving error', "error")

			}
		
		)

	}

	/*=============================================
	Validamos formulario
	=============================================*/

	invalidField(field:string){

		return functions.invalidField(field, this.f, this.formSubmitted);
		
	}

	/*=============================================
	Cambiar aprobación
	=============================================*/

	approve(event: MatSlideToggleChange, id: string){

 		this.visible = event.checked
 		console.log("this.visible", this.visible);

  	}



}
