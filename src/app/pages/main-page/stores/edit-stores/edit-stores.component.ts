import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { StoresService } from 'src/app/services/stores.service';
import { ImagesService } from 'src/app/services/images.service';
import { Istores } from 'src/app/interface/istores';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { alerts } from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface IDialogData{
	id:string;
}

@Component({
  selector: 'app-edit-stores',
  templateUrl: './edit-stores.component.html',
  styleUrls: ['./edit-stores.component.css']
})
export class EditStoresComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		about:['', [Validators.required,  Validators.pattern('[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
		email:['', [Validators.required, Validators.email]],
		country:['', [Validators.required,  Validators.pattern('[+\\_\\0-9A-Za-zñÑáéíóúÁÉÍÓÚ ]*')]],
		city:['', [Validators.required,  Validators.pattern('[A-Za-zñÑáéíóúÁÉÍÓÚ ]*')]],
		phone:['', [Validators.required,  Validators.pattern('[-\\0-9 ]*')]],
		address:['', [Validators.required, Validators.pattern('[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
		logo:'',
		cover:'',
		facebook:'',
		twitter:'',
		instagram:'',
		linkedin:'',
		youtube:''
	});

	/*=============================================
	Validación personalizada en la vista HTML
	=============================================*/

	get about() { return this.f.controls.about }
	get email() { return this.f.controls.email }
	get country() { return this.f.controls.country }
	get city() { return this.f.controls.city; }
	get phone() { return this.f.controls.phone; }
	get address() { return this.f.controls.address; }
	get logo() { return this.f.controls.logo; }
	get cover() { return this.f.controls.cover; }
	get facebook() { return this.f.controls.facebook; }
	get twitter() { return this.f.controls.twitter; }
	get instagram() { return this.f.controls.instagram; }
	get linkedin() { return this.f.controls.linkedin; }
	get youtube() { return this.f.controls.youtube; }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

	/*=============================================
	Visualizar del nombre de la tienda
	=============================================*/

	storeView = "";

	/*=============================================
	Visualizar la url
	=============================================*/

	urlView = "";

	/*=============================================
	Variable para almacenar la fecha
	=============================================*/

	date = "";

	/*=============================================
	Variable para almacenar la cantidad de productos
	=============================================*/

	products = "";

	/*=============================================
	Variable para almacenar el usuario de la tienda
	=============================================*/

	username = "";

	/*=============================================
	Variable para almacenar las redes sociales de la tienda
	=============================================*/

	social:any = {};

	/*=============================================
	Variable para almacenar listado de países
	=============================================*/

	countries:any = [];

	/*=============================================
	Subir la imagen al servidor
	=============================================*/

	logoTemp = "";
	uploadLogo = "";
	resultLogo = "";
	nameLogo = "";

	coverTemp = "";
	uploadCover = "";
	resultCover = "";
	nameCover = "";


	/*=============================================
	VIsualizar el código del teléfono
	=============================================*/

	dialCode = "";

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;

	constructor(private form: FormBuilder, 
				private storesService: StoresService, 
				private imagesService: ImagesService, 
				private http:HttpClient, 
				public dialogRef: MatDialogRef<EditStoresComponent>,  
				@Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

	ngOnInit(): void {

		this.storesService.getItem(this.data.id)
		.subscribe(

			(resp:any)=>{

				this.storeView = resp.store;

				this.urlView = resp.url;

				this.about.setValue(resp.about);

				this.email.setValue(resp.email);

				this.country.setValue(resp.country);

				this.city.setValue(resp.city);	

				this.phone.setValue(resp.phone.split("-")[1]);
				this.dialCode = resp.phone.split("-")[0];

				this.address.setValue(resp.address);

				this.logoTemp = `${environment.urlFiles}stores/${resp.url}/${resp.logo}`;
				this.nameLogo = resp.logo;

				this.coverTemp = `${environment.urlFiles}stores/${resp.url}/${resp.cover}`;
				this.nameCover = resp.cover;

				this.date = resp.date;	

				this.products = resp.products;

				this.username = resp.username;

				JSON.parse(resp.social).facebook ? this.facebook.setValue(JSON.parse(resp.social).facebook.split("/")[3]) : this.facebook.setValue("");

				JSON.parse(resp.social).instagram ? this.instagram.setValue(JSON.parse(resp.social).instagram.split("/")[3]) : this.instagram.setValue("");

				JSON.parse(resp.social).twitter ? this.twitter.setValue(JSON.parse(resp.social).twitter.split("/")[3]) : this.twitter.setValue("");

				JSON.parse(resp.social).linkedin ? this.linkedin.setValue(JSON.parse(resp.social).linkedin.split("/")[3]) : this.linkedin.setValue("");

				JSON.parse(resp.social).youtube ? this.youtube.setValue(JSON.parse(resp.social).youtube.split("/")[3]) : this.youtube.setValue("");
			}

		)

		/*=============================================
		Traer Listado de países
		=============================================*/

		this.http.get('./assets/json/countries.json')
		.subscribe(

			(resp:any)=>{

				this.countries = resp;
				
			}

		);

	}

	/*=============================================
	Función Save Store
	=============================================*/

	editStore(){

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
		Subir imagen del logo al servidor
		=============================================*/

		if(this.uploadLogo){

			this.imagesService.uploadImage(this.uploadLogo, "stores", this.urlView, 300, 300, this.nameLogo)
			.subscribe((resp:any)=>{

				if(resp.status == 200){

	    			this.resultLogo = resp.result;

	    		}else{

	    			alerts.basicAlert("Error", 'Invalid Logo', "error")

	    		}

			})


		}

	 	/*=============================================
		Verificar cambio de imagen de logo
		=============================================*/

		if(this.resultLogo == ""){

			this.resultLogo = this.nameLogo;
		}

		/*=============================================
		Subir imagen de portada al servidor
		=============================================*/

		if(this.uploadCover){

			this.imagesService.uploadImage(this.uploadCover, "stores", this.urlView, 1500, 800, this.nameCover)

			.subscribe((resp:any)=>{

	    		if(resp.status == 200){

	    			this.resultCover = resp.result;

	    		}else{

	    			alerts.basicAlert("Error", 'Invalid Logo', "error")

	    		}

	    	})

	    }

	    /*=============================================
		Verificar cambio de imagen de portada
		=============================================*/

		if(this.resultCover == ""){

			this.resultCover = this.nameCover;
		}

		/*=============================================
		Capturamos la información de las redes sociales
		=============================================*/


		if(this.f.controls.facebook.value){

			this.social['facebook'] = `http://facebook.com/${this.f.controls.facebook.value}`
		}

		if(this.f.controls.instagram.value){

			this.social['instagram'] = `http://instagram.com/${this.f.controls.instagram.value}`
		}

		if(this.f.controls.twitter.value){

			this.social['twitter'] = `http://twitter.com/${this.f.controls.twitter.value}`
		}

		if(this.f.controls.linkedin.value){

			this.social['linkedin'] = `http://linkedin.com/${this.f.controls.linkedin.value}`
		}

		if(this.f.controls.youtube.value){

			this.social['youtube'] = `http://youtube.com/${this.f.controls.youtube.value}`
			
		}

		/*=============================================
		Capturamos la información del formulario en la interfaz
		=============================================*/

		const dataStore: Istores = {	
		
			about:  this.f.controls.about.value,
			abstract: `${this.f.controls.about.value.substr(0,100)}...`,
			address: this.f.controls.address.value,
			city: this.f.controls.city.value,
			country: this.f.controls.country.value.split("_")[0],
			cover: this.nameCover,
			date:this.date,
			email:  this.f.controls.email.value,
			logo: this.nameLogo,
			phone: `${this.f.controls.country.value.split("_")[1]}-${this.f.controls.phone.value}`,
			products: Number(this.products),
			social: JSON.stringify(this.social),
		    store: this.storeView,
		    url: this.urlView, 
		    username: this.username

		}

		/*=============================================
		Guardar en base de datos la info de la tienda
		=============================================*/

		this.storesService.patchData(this.data.id, dataStore).subscribe(

			resp=>{

				this.loadData = false;

				this.dialogRef.close('save');

				alerts.basicAlert("Ok", 'The store has been saved', "success")			

			},

			err =>{

				this.loadData = false;

				alerts.basicAlert("Error", 'Store saving error', "error")

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
	Validamos imagen del logo
	=============================================*/

	validateLogo(e:any){

		functions.validateImage(e).then((resp:any)=>{

			this.logoTemp = resp;
			this.uploadLogo = e;

		})


	}

	/*=============================================
	Validamos imagen de la portada
	=============================================*/

	validateCover(e:any){

		functions.validateImage(e).then((resp:any)=>{

			this.coverTemp = resp;
			this.uploadCover = e;

		})


	}

	/*=============================================
	Cambio de País para capturar el código telefónico
	=============================================*/

	changeCountry(e:any){

		this.dialCode = e.target.value.split("_")[1];

	}

}
