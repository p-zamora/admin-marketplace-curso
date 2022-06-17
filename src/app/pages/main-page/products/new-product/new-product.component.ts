import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { ProductsService } from 'src/app/services/products.service';
import { Iproducts } from 'src/app/interface/iproducts';
import { CategoriesService } from 'src/app/services/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { ImagesService } from 'src/app/services/images.service';
import { alerts } from 'src/app/helpers/alerts';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		name:['', { validators: [Validators.required, Validators.maxLength(50), Validators.pattern(/[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,50}/) ], asyncValidators: [this.isRepeatProduct()], updateOn: 'blur'}],
		category:['', [Validators.required]],
		sub_category:['', [Validators.required]],
		image:['', [Validators.required]],
		description:['', [Validators.required]],
		summary:[[], [Validators.required]],
		details:new FormArray([this.form.group({

			title:['',[Validators.required]],
			value:['',[Validators.required]]

		})]),
		specifications:new FormArray([this.form.group({

			type:[''],
			values:[[]]

		})]),
		tags:[[], [Validators.required, Validators.pattern(/[0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
		top_banner:new FormArray([

			this.form.group({

				H3_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				P1_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				H4_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				P2_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				Span_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				Button_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				IMG_tag: ['', [Validators.required]]

			})

		]),
		default_banner:['', [Validators.required]],
		horizontal_slider:new FormArray([

			this.form.group({

				H4_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				H3_1_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				H3_2_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				H3_3_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				H3_4s_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				Button_tag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
				IMG_tag: ['', [Validators.required]]

			})

		]),
		vertical_slider:['', [Validators.required]],
		type_video:[''],
		id_video:['', [Validators.pattern(/[[-\\_\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
	 	price: ['', [Validators.required, Validators.min(0), Validators.pattern(/[.\\,\\0-9]{1,}/)]],
      	shipping: ['', [Validators.required, Validators.min(0), Validators.pattern(/[.\\,\\0-9]{1,}/)]],
      	delivery_time: ['', [Validators.required, Validators.min(1), Validators.pattern(/[0-9]{1,}/)]],
      	stock: ['', [Validators.required, Validators.min(1), Validators.max(100) , Validators.pattern(/[0-9]{1,}/)]],
      	type_offer: ['Disccount'],
        value_offer: ['', [Validators.pattern(/^[+]?\d+([.]\d+)?$/)]],
        date_offer: ['']

	})

	/*=============================================
	Validación personalizada
	=============================================*/

	get name(){return this.f.controls.name}
	get category() { return this.f.controls.category }
	get sub_category() { return this.f.controls.sub_category }
	get image() { return this.f.controls.image }
	get description() { return this.f.controls.description }
	get summary() { return this.f.controls.summary }
	get details() { return this.f.controls.details as any; }
	get specifications() { return this.f.controls.specifications as any; }
	get tags() { return this.f.controls.tags }
	get top_banner() { return this.f.controls.top_banner as any; }
	get default_banner() { return this.f.controls.default_banner }
	get horizontal_slider() { return this.f.controls.horizontal_slider as any; }
	get vertical_slider() { return this.f.controls.vertical_slider }
	get type_video() { return this.f.controls.type_video }
	get id_video() { return this.f.controls.id_video }
	get price() { return this.f.controls.price }
	get shipping() { return this.f.controls.shipping }
	get delivery_time() { return this.f.controls.delivery_time }
	get stock() { return this.f.controls.stock }
	get type_offer() { return this.f.controls.type_offer }
	get value_offer() { return this.f.controls.value_offer }
	get date_offer() { return this.f.controls.date_offer }

	/*=============================================
	Variable que valida el envío del formulario
	=============================================*/

	formSubmitted = false;

	/*=============================================
	Variable para precarga
	=============================================*/

	loadData = false;

	/*=============================================
	Visualizar el nombre de la tienda
	=============================================*/

	storeInput = "";

	/*=============================================
	Visualizar la url
	=============================================*/

	urlInput = "";

	/*=============================================
	Variable para almacenar la información de la categoría
	=============================================*/

	categories:any = [];

	/*=============================================
	Variable para almacenar la información de la subcategoría
	=============================================*/

	subcategories:any = [];

	/*=============================================
	Variable para almacenar el listado de título
	=============================================*/

	titleList = "";

	/*=============================================
	Variable global que almacena la imagen temporal del producto
	=============================================*/
	
	imgTemp = "";
	uploadFile = "";
	nameImage = "";

	/*=============================================
	Galería de imagenes
	=============================================*/

	files: File[] = [];

	onSelect(event:any) {
	  this.files.push(...event.addedFiles);
	}

	onRemove(event:any) {
	  this.files.splice(this.files.indexOf(event), 1);
	}

	/*=============================================
	Configuración Summernote
	=============================================*/

	config = {
	    placeholder: '',
	    tabsize: 2,
	    height: 400,
	    toolbar: [
	        ['misc', ['codeview', 'undo', 'redo']],
	        ['style', ['bold', 'italic', 'underline', 'clear']],
	        ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
	        ['insert', [ 'picture', 'link', 'hr']]
	    ],
	    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  	}


  	/*=============================================
    Variables de tipo arreglo con objeto para el resumen del producto
    =============================================*/

    summaryGroup: any[] = [{

        input:''

    }]

    /*=============================================
	Configuración Mat Chips: Etiquetas dentro del Input Title List
	=============================================*/

 	visible = true;
  	selectable = true;
  	removable = true;
  	addOnBlur = true;
  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  	/*=============================================
	Adicionar Chips
	=============================================*/

 	add(event: MatChipInputEvent, index:number, type:any): void {
	    
	    const input = event.input;
	    
	    const value = event.value;

	    // Add 
	    if ((value || '').trim()) {


	  		if(type == "specifications"){

		    	let controlSpec = this.specifications.controls[index] as FormGroup;

		    	if(controlSpec.controls.values.value.length < 3){

		    		controlSpec.controls.values.value.push(`${value.trim()}`);

		    		controlSpec.controls.values.updateValueAndValidity();

		    	}

		    }

		    if(type == "tags"){ 

		    	this.f.controls.tags.value.push(value.trim());
		    	this.f.controls.tags.updateValueAndValidity(); 
		    }
	       
	    }

	    // Reset the input value
	    if (input) {
	      input.value = '';
	    }

  	}

  	/*=============================================
	Remover Chips
	=============================================*/

 	remove(value:any, index:number, type:any): void {

 		if(type == "specifications"){

	 		let controlSpec = this.specifications.controls[index] as FormGroup;

		    const optIndex =  controlSpec.controls.values.value.indexOf(value);

		    if (index >= 0) {
		       
		       controlSpec.controls.values.value.splice(index, 1);
		       controlSpec.controls.values.updateValueAndValidity();
		      
		    }

		}

		if(type == "tags"){

			const index =  this.f.controls.tags.value.indexOf(value);

		    if (index >= 0) {
		       
		       this.f.controls.tags.value.splice(index, 1);
		       this.f.controls.tags.updateValueAndValidity();
		      
		    }
	    
		}

  	}

	/*=============================================
	Variable global que almacena la imagen temporal para el Top Banner
	=============================================*/
	
	imgTempTB = "";
	uploadFileTB = "";

	/*=============================================
	Variable global que almacena la imagen temporal para el Default Banner
	=============================================*/
	
	imgTempDB = "";
	uploadFileDB = "";
	nameImageDB = "";

	/*=============================================
	Variable global que almacena la imagen temporal para el Slide Horizontal
	=============================================*/
	
	imgTempHSlider = "";
	uploadFileHSlider = "";

	/*=============================================
	Variable global que almacena la imagen temporal para el Slide Vertical
	=============================================*/
	
	imgTempVSlider = "";
	uploadFileVSlider = "";
	nameImageVSlider = "";

	constructor(private activatedRoute: ActivatedRoute, 
		        private form: FormBuilder,
		        private productsService: ProductsService,
		        private categoriesService: CategoriesService,
		        private subcategoriesService: SubcategoriesService,
		        private imagesService: ImagesService,
		        private router: Router 
		        ) { }

	ngOnInit(): void {

		/*=============================================
		Capturamos el nombre de la tienda
		=============================================*/

		this.activatedRoute.params.subscribe((params)=>{

			this.storeInput = params["store"];

		})

		/*=============================================
		Capturamos la información de las categorías
		=============================================*/

		this.categoriesService.getData()
		.subscribe( 

			(resp: any) => {

				this.categories = Object.keys(resp).map(

					a => ({

						name:resp[a].name,
						titleList:JSON.parse(resp[a].title_list),
						url:resp[a].url

					})

				)

			}
		)

	}

	/*=============================================
	Función Save Product
	=============================================*/

	saveProduct(){

		/*=============================================
		Validamos que el formulario haya sido enviado
		=============================================*/

		this.formSubmitted = true;

		/*=============================================
		Validamos que el formulario esté correcto
		=============================================*/

		console.log("JSON.stringify(this.top_banner.value[0]).replace(/[_]/g,\" \")", JSON.stringify(this.top_banner.value[0]).replace(/[_]/g," "));

		if(this.f.invalid){

			return;
		}

		/*=============================================
		Variable precarga mientras la información se guarda en BD
		=============================================*/

		this.loadData = true;

		/*=============================================
        Subir imagenes al servidor
        =============================================*/

        let countAllImages = 0;

        let allImages = [

         	{
                type:'imageProduct',
                file: this.uploadFile,
                folder:this.f.controls.category.value.split("_")[0],
                path:'products',
                width:300,
                height:300,
                name: this.urlInput
            },

            {
                type:'topBannerImg',
                file: this.uploadFileTB,
                folder:`${this.f.controls.category.value.split("_")[0]}/top`,
                path:'products',
                width:1920,
                height:80,
                name: null
            },

            {
                type:'defaultBannerImg',
                file: this.uploadFileDB,
                folder:`${this.f.controls.category.value.split("_")[0]}/default`,
                path:'products',
                width:570,
                height:210,
                name: null
            },
          	{
                type:'hSliderImg',
                file: this.uploadFileHSlider,
                folder:`${this.f.controls.category.value.split("_")[0]}/horizontal`,
                path:'products',
                width:1920,
                height:358,
                name: null
            },
            {
                type:'vSliderImg',
                file: this.uploadFileVSlider,
                folder:`${this.f.controls.category.value.split("_")[0]}/vertical`,
                path:'products',
                width:263,
                height:629,
                name: null
            }

        ]

        allImages.forEach((value) => {  

        	this.imagesService.uploadImage(value.file, value.path, value.folder, value.width, value.height, value.name)
        	.subscribe((resp:any)=>{

        		if(resp.status == 200){

        			switch(value.type){

        				case "imageProduct":
        				this.nameImage = resp["result"];
        				break;

        				case "topBannerImg":
                        this.f.controls.top_banner.value[0].IMG_tag = resp["result"];
                        break;

                        case "defaultBannerImg":
                        this.nameImageDB = resp["result"];
                        break;

                     	case "hSliderImg":
                        this.f.controls.horizontal_slider.value[0].IMG_tag = resp["result"];
                        break;

                     	case "vSliderImg":
                        this.nameImageVSlider = resp["result"];
                        break;

        			}

        			countAllImages++

        			/*=============================================
                    Preguntamos cuando termina de subir todas las imágenes
                    =============================================*/

                    if(countAllImages == allImages.length){

                    	/*=============================================
				        Consolidar Galería
				        =============================================*/

				        let countGallery = 0;
				        let gallery:any = [];

				        this.files.forEach((value)=>{

				        	this.imagesService.uploadImage(value, "products", `${this.f.controls.category.value.split("_")[0]}/gallery`, 1000,1000, null)
        					.subscribe((resp:any)=>{

        						if(resp["status"] == 200){  

        							gallery.push(resp["result"]);

        							countGallery++;

        							 /*=============================================
		                            Preguntamos cuando termina de subir toda la galería
		                            =============================================*/
		                            if(countGallery == this.files.length){

		                            	/*=============================================
								        Consolidar especificaciones del producto
								        =============================================*/

								        let specifications:any = null; 

								        if(Object.keys(this.f.controls.specifications.value).length > 0){

								        	let newSpecifications = [];

								        	for(const i in this.f.controls.specifications.value){

								        		let newValue = [];
								        		
								        		for(const f in this.f.controls.specifications.value[i].values){
														
													newValue.push(`'${this.f.controls.specifications.value[i].values[f]}'`);

								        		}

								        		newSpecifications.push(`{'${this.f.controls.specifications.value[i].type}':[${newValue}]}`)

								        		specifications = JSON.stringify(newSpecifications);
								        		specifications = specifications.replace(/["]/g, '');
												specifications = specifications.replace(/[']/g, '"');

												if(specifications == "[{\"\":[]}]"){

													specifications = "";
												}
								  
								        	}

								        }else{

								            specifications = "";
								        }

		                            	/*=============================================
										Capturamos la información del formulario en la interfaz
										=============================================*/

										const dataProduct: Iproducts = {

											category:this.f.controls.category.value.split("_")[0],
											date_created:new Date(),
											default_banner:this.nameImageDB,
											delivery_time:this.f.controls.delivery_time.value,
											description:this.f.controls.description.value,
											details:JSON.stringify(this.details.value),
											feedback:'{\"type\":\"approved\", \"comment\":\"\"}',
											gallery:JSON.stringify(gallery),
											horizontal_slider:JSON.stringify(this.horizontal_slider.value[0]).replace(/[_]/g," ").replace('H3 1 tag','H3-1 tag').replace('H3 2 tag','H3-2 tag').replace('H3 3 tag','H3-3 tag').replace('H3 4s tag','H3-4s tag'),
											image:this.nameImage,
											name:this.f.controls.name.value,
											offer:this.value_offer.value ?  JSON.stringify([ this.type_offer.value, this.value_offer.value, this.date_offer.value]) : "",
											price:this.f.controls.price.value,
											reviews:'[]',
											sales:0,
											shipping:this.f.controls.shipping.value,
											specification:specifications,
											stock:this.f.controls.stock.value,
											store:this.storeInput,
											sub_category:this.f.controls.sub_category.value.split("_")[0],
											summary:JSON.stringify(this.f.controls.summary.value),
											tags:JSON.stringify(this.f.controls.tags.value),
											title_list:this.titleList,
											top_banner:JSON.stringify(this.top_banner.value[0]).replace(/[_]/g," "),
											url:this.urlInput,
											vertical_slider:this.nameImageVSlider,
											video: this.id_video.value ? JSON.stringify([ this.type_video.value, this.id_video.value]): "[]",
											views:0

										}

										/*=============================================
										Guardar en base de datos la info del producto
										=============================================*/

										this.productsService.postData(dataProduct).subscribe(

											resp=>{

												this.loadData = false;	

												alerts.saveAlert("Ok", 'The product has been saved', "success").then(()=> this.router.navigate(['products']))		

											},	

											err =>{

												this.loadData = false;		

												alerts.basicAlert("Error", 'Product saving error', "error")

											}

										)

		                            }

        						}

        					})


				        })

 
                    }

        		}
        	
        	})

        })

	}

	/*=============================================
	Validamos formulario
	=============================================*/

	invalidField(field:string){

		return functions.invalidField(field, this.f, this.formSubmitted);

	}

	/*=============================================
	Validar que el nombre de producto no se repita
	=============================================*/

	isRepeatProduct(){

		return(control: AbstractControl ) =>{

			const name = functions.createUrl(control.value);

			return new Promise((resolve)=>{

				this.productsService.getFilterData("url", name).subscribe(

					resp =>{

						if(Object.keys(resp).length > 0){

							resolve({product: true}) 
						
						}else{

							resolve(null);
							this.urlInput = name;

						}

					}

				)

			})
		}
	}

	/*=============================================
	Función para filtrar las subcategorías
	=============================================*/

	selectCategory(e:any){

		this.categories.filter((category:any)=>{

			if(category.name == e.target.value.split("_")[1]){

				/*=============================================
				Capturamos la información de las subcategorías
				=============================================*/

				this.subcategoriesService.getFilterData("category", category.name)
				.subscribe( 

					(resp: any) => {

						this.subcategories = Object.keys(resp).map(

							a => ({

								name:resp[a].name,
								titleList:resp[a].title_list,
								url:resp[a].url

							})

						)

					}

				)

			}

		})

	}
	
	/*=============================================
	Función para filtrar el listado de título
	=============================================*/

	selectSubCategory(e:any){

		this.subcategories.filter((subcategory:any)=>{

			if(subcategory.name == e.target.value.split("_")[1]){

				this.titleList = subcategory.titleList;

			}

		})

	}

	/*=============================================
	Validamos imagen
	=============================================*/

	validateImage(e:any, type:string){

		functions.validateImage(e).then((resp:any)=>{

			if(type == "image"){

				this.imgTemp = resp;
				this.uploadFile = e;

			}

			if(type == "TB"){

				this.imgTempTB = resp;
				this.uploadFileTB = e;

			}

			if(type == "DB"){

				this.imgTempDB = resp;
				this.uploadFileDB = e;

			}

			if(type == "HSlider"){

				this.imgTempHSlider = resp;
				this.uploadFileHSlider = e;

			}

			if(type == "VSlider"){

				this.imgTempVSlider = resp;
				this.uploadFileVSlider = e;

			}

		})

	}

	/*=============================================
    Adicionar Input's de forma dinámica
    =============================================*/

    addInput(type:any){

    	if(type == "summary"){

    		if(this.summaryGroup.length < 5){

	    		this.summaryGroup.push({

	    			input:''
	    		
	    		})

	    	}else{

	    		alerts.basicAlert("Error", "Entry limit has been exceeded", "error")

	    	}

    	}

    	if(type == "details"){

    		if(this.details.length < 5){

			 	this.details.push(this.form.group({
			        title: ['', [Validators.required]],
			        value: ['', [Validators.required]]
		      	}))

		    }else{

		    	alerts.basicAlert("Error", "Entry limit has been exceeded", "error")
		    }

    	}

    	if(type == "specifications"){

    		if(this.specifications.length < 5){

			 	this.specifications.push(this.form.group({
			        type: [''],
			        values: [[]]
		      	}))

		    }else{

		    	alerts.basicAlert("Error", "Entry limit has been exceeded", "error")
		    }

    	}

    }

    /*=============================================
    Quitar Input's de forma dinámica
    =============================================*/

    removeInput(i:any, type:any){

    	if(i > 0){

		 	if(type == "summary"){

		 		this.summaryGroup.splice(i, 1);

		 		this.f.controls.summary.value.splice(i, 1);

		 		this.f.controls.summary.updateValueAndValidity();
		 	}

	 	  	if(type == "details"){

         		this.details.removeAt(i);
	      
	        }

	        if(type == "specifications"){

         		this.details.removeAt(i);
	      
	        }

		}

    }

  /*=============================================
	Adicionar Resumen
	=============================================*/

	addItem(e:any, type:any, i:any){	

		if(type == "summary"){

			if ((e.target.value || '').trim()) {

				this.f.controls.summary.value.push(e.target.value.trim());   

			}

			this.f.controls.summary.updateValueAndValidity();

		}
 
	}


}
