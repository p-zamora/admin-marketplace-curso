import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Isubcategories } from 'src/app/interface/isubcategories';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-subcategories',
  templateUrl: './new-subcategories.component.html',
  styleUrls: ['./new-subcategories.component.css']
})
export class NewSubcategoriesComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		category:['', [Validators.required]],
		name:['', { validators: [Validators.required, Validators.pattern('[,\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]*') ], asyncValidators: [this.isRepeatSubCategory()], updateOn: 'blur'}],
		titleList:['', [Validators.required]]
	
	})
		
	/*=============================================
	Validación personalizada
	=============================================*/

	get category() { return this.f.controls.category }
	get name() { return this.f.controls.name }
	get titleList() { return this.f.controls.titleList }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

	/*=============================================
	Visualizar la url
	=============================================*/

	urlInput = "";

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;

	/*=============================================
	Variable para almacenar la información de la categoría
	=============================================*/

	categories:any = [];

	/*=============================================
	Variable para mostrar la información de listado de títulos
	=============================================*/
	
	titleListArray:any = [];

	constructor(private form: FormBuilder, private subcategoriesService: SubcategoriesService,  public dialogRef: MatDialogRef<NewSubcategoriesComponent>,  private categoriesService: CategoriesService) { }

	ngOnInit(): void {

		/*=============================================
		Capturamos la información de las categorías
		=============================================*/

		this.categoriesService.getData()
		.subscribe( 

			(resp: any) => {
				
				this.categories = Object.keys(resp).map(

					a => ({
						
						name:resp[a].name,
						titleList:JSON.parse(resp[a].title_list)

					})

				)

			}

		)

	}

	/*=============================================
	Función Save SubCategory
	=============================================*/

	saveSubCategory(){

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

			category:this.f.controls.category.value,
			name:this.f.controls.name.value,
			title_list:this.f.controls.titleList.value,
			url:this.urlInput, 
			products_inventory: 0,
			view:0

		}

		/*=============================================
		Guardar en base de datos la info de la Subcategoría
		=============================================*/

		this.subcategoriesService.postData(dataSubCategory).subscribe(

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

	/*=============================================
	Validar que el nombre de categoría no se repita
	=============================================*/

	isRepeatSubCategory(){

		return(control: AbstractControl ) =>{

			const name = functions.createUrl(control.value);

			return new Promise((resolve)=>{

				this.subcategoriesService.getFilterData("url", name).subscribe(

					resp =>{

						if(Object.keys(resp).length > 0){

							resolve({subcategory: true}) 

						}else{
							this.urlInput = name;
						}


					}

				)


			})


		}


	}

	/*=============================================
	Función para filtrar el listado de título
	=============================================*/

	selectCategory(e:any){
		
		console.log("e", e.target.value);

		this.categories.filter((category:any)=>{

			if(category.name == e.target.value){

				this.titleListArray = category.titleList;
				
			}

		})



	}


}
