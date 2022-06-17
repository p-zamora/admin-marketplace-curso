import { Component, OnInit, Inject  } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { CategoriesService } from 'src/app/services/categories.service';
import { Icategories } from 'src/app/interface/icategories';
import { ImagesService } from 'src/app/services/images.service';
import { alerts } from 'src/app/helpers/alerts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface IDialogData{
	id:string;
}

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css']
})
export class EditCategoriesComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		icon:['', Validators.required],
		image:''
		
	})

	/*=============================================
	Validación personalizada
	=============================================*/
	
	get image() { return this.f.controls.image }
	get icon() { return this.f.controls.icon; }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;	

	/*=============================================
	Visualizar del nombre de la categoría
	=============================================*/

	nameView = "";

	/*=============================================
	Visualizar el listado de títulos de la categoría
	=============================================*/

	titleView = "";

	/*=============================================
	Visualizar la url
	=============================================*/

	urlInput = "";

  	/*=============================================
	Visualizar el icono
	=============================================*/

	iconView = "";

	/*=============================================
	Subir la imagen al servidor
	=============================================*/

	imgTemp = "";
	uploadFile = "";
	resultImg = "";
	nameImage = "";

	/*=============================================
	Variables de estado y visualización
	=============================================*/

	state = "";
	view = "";

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;

	constructor(private form: FormBuilder, private categoriesService: CategoriesService, private imagesService: ImagesService, public dialogRef: MatDialogRef<EditCategoriesComponent>,  @Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

	ngOnInit(): void {

		this.categoriesService.getItem(this.data.id)
		.subscribe(

			(resp:any)=>{

				this.icon.setValue(resp.icon);			
				this.iconView = `<i class="${resp.icon}"></i>`;

				this.imgTemp = `${environment.urlFiles}categories/${resp.image}`;
				this.nameImage = resp.image;

				this.nameView = resp.name;

				this.urlInput = resp.url;

				this.titleView = JSON.parse(resp.title_list);

				this.state = resp.state;

				this.view = resp.view;

			}

		)

	}

	/*=============================================
	Función Save Category
	=============================================*/

	editCategory(){

		

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
		Subir imagen al servidor
		=============================================*/

		if(this.uploadFile){

			this.imagesService.uploadImage(this.uploadFile, "categories", "", 170, 170, this.nameImage).subscribe((resp:any)=>{

	    		if(resp.status == 200){

	    			this.resultImg = resp.result;

	    		}else{

	    			alerts.basicAlert("Error", 'Invalid Picture', "error")

	    		}

	    	})

	    }

		/*=============================================
		Verificar cambio de imagen
		=============================================*/

		if(this.resultImg == ""){

			this.resultImg = this.nameImage;
		}

		/*=============================================
		Verificar cambio de icono
		=============================================*/

		let icon = this.f.controls.icon.value;

		if(this.f.controls.icon.value.split('"')[1] != undefined){

			icon = this.f.controls.icon.value.split('"')[1];
		}

		/*=============================================
		Capturamos la información del formulario en la interfaz
		=============================================*/

		const dataCategory: Icategories = {	
			
			icon:icon,
			image: this.nameImage,
			name:this.nameView,
			title_list:JSON.stringify(this.titleView),
			url:this.urlInput, 
			view:Number(this.view),
			state:this.state

		}
		
		/*=============================================
		Guardar en base de datos la info de la categoría
		=============================================*/

		this.categoriesService.patchData(this.data.id, dataCategory).subscribe(

			resp=>{

				this.loadData = false;		

				this.dialogRef.close('save');

				alerts.basicAlert("Ok", 'The category has been saved', "success")			

			},

			err =>{

				this.loadData = false;		

				alerts.basicAlert("Error", 'Category saving error', "error")

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
	Validamos imagen
	=============================================*/

	validateImage(e:any){

		functions.validateImage(e).then((resp:any)=>{

			this.imgTemp = resp;
			this.uploadFile = e;

		})


	}


	/*=============================================
	Visualizar el Icono
	=============================================*/

	viewIcon(e:any){
		
		this.iconView = e.target.value;

		e.target.value = this.f.controls.icon.value.split('"')[1];	
	
	}

}
