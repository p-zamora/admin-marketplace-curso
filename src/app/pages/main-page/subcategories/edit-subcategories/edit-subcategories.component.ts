import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Isubcategories } from 'src/app/interface/isubcategories';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { CategoriesService } from 'src/app/services/categories.service';

export interface IDialogData{
	id:string;
}

@Component({
  selector: 'app-edit-subcategories',
  templateUrl: './edit-subcategories.component.html',
  styleUrls: ['./edit-subcategories.component.css']
})
export class EditSubcategoriesComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		titleList:['', Validators.required]
	
	})

	/*=============================================
	Validación personalizada
	=============================================*/

	get titleList() { return this.f.controls.titleList }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

	/*=============================================
	Visualizar del nombre de la categoría
	=============================================*/

	categoryView = "";

	/*=============================================
	Visualizar del nombre de la categoría
	=============================================*/

	nameView = "";

	/*=============================================
	Visualizar la url
	=============================================*/

	urlInput = "";

	/*=============================================
	Variables de inventario y visualización
	=============================================*/

	products_inventory = "";
	view = "";
	
	/*=============================================
	Variables para la edición del listado de título
	=============================================*/

	selectTL = "";
	titleListArray:any = [];

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;


  	constructor(private form: FormBuilder, 
  		        private subcategoriesService: SubcategoriesService, 
  		        private categoriesService: CategoriesService,
  		        public dialogRef: MatDialogRef<EditSubcategoriesComponent>,  
  		        @Inject(MAT_DIALOG_DATA) public data:  IDialogData) { }

  	ngOnInit(): void {

  		this.subcategoriesService.getItem(this.data.id)
		.subscribe(

			(resp:any)=>{

				this.categoryView = resp.category;

				this.titleList.setValue(resp.title_list);	

				this.selectTL = resp.title_list;

				this.nameView = resp.name;

				this.urlInput = resp.url;

				this.products_inventory = resp.products_inventory;

				this.view = resp.view;

				/*=============================================
				Traer la información de la categoría seleccionada
				=============================================*/

				this.categoriesService.getFilterData("name", resp.category)
				.subscribe(

					(resp:any)=>{

						this.titleListArray = Object.keys(resp).map(
						
							a => (
								
								JSON.parse(resp[a].title_list)

							)

						)

					}

				)

				
			}

		)		
		
  	}

  	/*=============================================
	Función Save SubCategory
	=============================================*/

	editSubCategory(){

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
		Capturamos la información del formulario en la interfaz
		=============================================*/

		const dataSubCategory: Isubcategories = {	
			
	
			category:this.categoryView,
			name:this.nameView,
			title_list:this.f.controls.titleList.value,
			url:this.urlInput, 
			products_inventory:Number(this.products_inventory),
			view:Number(this.view)
			

		}

		/*=============================================
		Guardar en base de datos la info de la categoría
		=============================================*/

		this.subcategoriesService.patchData(this.data.id, dataSubCategory)
		.subscribe(

			resp=>{

				this.loadData = false;

				this.dialogRef.close('save');

				alerts.basicAlert("Ok", 'The Subcategory has been saved', "success")			

			},

			err =>{

				this.loadData = false;

				alerts.basicAlert("Error", 'Subcategory saving error', "error")

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
