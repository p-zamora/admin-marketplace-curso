import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { functions } from 'src/app/helpers/functions';
import { CategoriesService } from 'src/app/services/categories.service';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { Iproducts } from 'src/app/interface/iproducts';
import { environment } from 'src/environments/environment';
import { ImagesService } from 'src/app/services/images.service';
import { alerts } from 'src/app/helpers/alerts';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

	/*=============================================
	Creamos grupo de controles
	=============================================*/

	public f = this.form.group({

		name:['',{validators:  [Validators.required, Validators.maxLength(50), Validators.pattern(/[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,50}/)] }],
		sub_category:['', [Validators.required]],
		image:[''],
		description:['', [Validators.required]],
		summary:[[], [Validators.required]],
		details:new FormArray([]),
		specifications:new FormArray([]),
		tags:[[], [Validators.required, Validators.pattern(/[0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
		top_banner:new FormArray([]),
		default_banner:[''],
		horizontal_slider:new FormArray([]),
		vertical_slider:[''],
		type_video:[''],
		id_video:['', [Validators.pattern(/[[-\\_\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
		price: ['', [Validators.required, Validators.min(0), Validators.pattern(/[.\\,\\0-9]{1,}/)]],
      	shipping: ['', [Validators.required, Validators.min(0), Validators.pattern(/[.\\,\\0-9]{1,}/)]],
      	delivery_time: ['', [Validators.required, Validators.min(1), Validators.pattern(/[0-9]{1,}/)]],
      	stock: ['', [Validators.required, Validators.min(1), Validators.max(100) , Validators.pattern(/[0-9]{1,}/)]],
      	type_offer: [''],
        value_offer: ['', [Validators.pattern(/^[+]?\d+([.]\d+)?$/)]],
        date_offer: ['']

	})

	/*=============================================
	Validación personalizada
	=============================================*/

	get name(){return this.f.controls.name}
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

	category = "";

	/*=============================================
	Variable para almacenar la información de las subcategorías
	=============================================*/

	subcategories:any = [];

	/*=============================================
	Variable para almacenar el listado de título
	=============================================*/

	titleList = "";

	/*=============================================
	Variablea globales que almacena la imagen temporal del producto
	=============================================*/

	urlFiles = environment.urlFiles;
	nameImage = "";
	uploadFile = "";
	imgTemp = "";
	countAllImages = 0;
	allImages:any = [];

	/*=============================================
	Galería de imagenes
	=============================================*/

	editGallery:any = [];
	deleteGallery:any = [];

	files: File[] = [];

	onSelect(event:any) {
	  this.files.push(...event.addedFiles);
	}

	onRemove(event:any) {
	  this.files.splice(this.files.indexOf(event), 1);
	}

	gallery:any = [];
	countGallery = 0;

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
	nameImageTB = "";

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
	nameImageHSlider = "";

	/*=============================================
	Variable global que almacena la imagen temporal para el Slide Vertical
	=============================================*/
	
	imgTempVSlider = "";
	uploadFileVSlider = "";
	nameImageVSlider = "";

	/*=============================================
	Variable globales para completar información del producto
	=============================================*/

	date_created = "";
	feedback = "";
	reviews = "";
	sales = 0;
	views = 0;

	/*=============================================
	Variable global del ID del producto
	=============================================*/

	idProduct = "";

	constructor(private activatedRoute: ActivatedRoute,
		        private productsService: ProductsService,
		        private form: FormBuilder,
		        private categoriesService: CategoriesService,
		        private subcategoriesService: SubcategoriesService,
		        private imagesService: ImagesService,
		        private router: Router) { }

	ngOnInit(): void {

		/*=============================================
		Capturamos el producto de acuerdo a su ID
		=============================================*/

		this.activatedRoute.params.subscribe((params)=>{

			this.idProduct = params["id"];
			
			this.productsService.getItem(this.idProduct)
			.subscribe( (resp:any) => {
				
				this.storeInput = resp.store;
				this.name.setValue(resp.name);
				this.urlInput = resp.url;
				this.category = resp.category;
				this.sub_category.setValue(resp.sub_category);
				this.titleList = resp.title_list;
				this.nameImage = resp.image;
				this.editGallery = JSON.parse(resp.gallery);
				this.description.setValue(resp.description);
				this.summary.setValue( JSON.parse(resp.summary));

				JSON.parse(resp.summary).forEach((sum:any,index:number)=>{

					this.summaryGroup[index] = {'input':sum}

				})

				JSON.parse(resp.details).forEach((detail:any)=>{

					this.details.push(this.form.group({
				        title: [detail.title, [Validators.required]],
				        value: [detail.value, [Validators.required]]
			      	}))

				})

				if(JSON.parse(resp.specification).length > 0){

					JSON.parse(resp.specification).forEach((spec:any)=>{
						
						const specValue = Object.keys(spec).map((a) => ({

							key: a,
							values: spec[a],

						} as any ))

						this.specifications.push(this.form.group({
					        type: [specValue[0].key],
					        values: [specValue[0].values]
				      	}))

				    })

				}

				this.tags.setValue( JSON.parse(resp.tags));

				this.nameImageTB = JSON.parse(resp.top_banner)['IMG tag'];

				this.top_banner.push(

						this.form.group({
				        H3_tag: [JSON.parse(resp.top_banner)['H3 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						P1_tag: [JSON.parse(resp.top_banner)['P1 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						H4_tag: [JSON.parse(resp.top_banner)['H4 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						P2_tag: [JSON.parse(resp.top_banner)['P2 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						Span_tag: [JSON.parse(resp.top_banner)['Span tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						Button_tag: [JSON.parse(resp.top_banner)['Button tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						IMG_tag: ['']
			      	})

				)

				this.nameImageDB = resp.default_banner;

				this.nameImageHSlider = JSON.parse(resp.horizontal_slider)['IMG tag'];

				this.horizontal_slider.push(

						this.form.group({
				        H4_tag: [JSON.parse(resp.horizontal_slider)['H4 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						H3_1_tag: [JSON.parse(resp.horizontal_slider)['H3-1 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						H3_2_tag: [JSON.parse(resp.horizontal_slider)['H3-2 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						H3_3_tag: [JSON.parse(resp.horizontal_slider)['H3-3 tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						H3_4s_tag: [JSON.parse(resp.horizontal_slider)['H3-4s tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						Button_tag: [JSON.parse(resp.horizontal_slider)['Button tag'], [Validators.required, Validators.maxLength(50), Validators.pattern(/[[-\\(\\)\\=\\%\\&\\$\\;\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZáéíóúñÁÉÍÓÚÑ ]{1,}/)]],
						IMG_tag: ['']
			      	})

				)

				this.nameImageVSlider = resp.vertical_slider;

			 	this.type_video.setValue( JSON.parse(resp.video)[0]);
      			this.id_video.setValue( JSON.parse(resp.video)[1]);

  			  	this.price.setValue(resp.price);
		      	this.shipping.setValue(resp.shipping);
		      	this.delivery_time.setValue(resp.delivery_time);
		      	this.stock.setValue(resp.stock);

		      	this.type_offer.setValue( JSON.parse(resp.offer)[0]);
      			this.value_offer.setValue( JSON.parse(resp.offer)[1]);
      			this.date_offer.setValue( JSON.parse(resp.offer)[2]);

      			this.date_created = resp.date_created;
				this.feedback = resp.feedback;
				this.reviews = resp.reviews;
				this.sales = resp.sales;
				this.views = resp.views;

				/*=============================================
				Capturamos la información de la categoría
				=============================================*/

				this.categoriesService.getFilterData("url",this.category)
				.subscribe( 

					(resp: any) => {
						
						Object.keys(resp).map(a=>{

							/*=============================================
							Capturamos la información de las subcategorías
							=============================================*/

							this.subcategoriesService.getFilterData("category",resp[a].name)
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

						})

					}

				)

			})

		})


	}

	/*=============================================
	Función Save Product
	=============================================*/

	async saveProduct(){

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
		Variable precarga mientras la información se guarda en BD
		=============================================*/

		this.loadData = true;

		/*=============================================
        Subir imagenes al servidor
        =============================================*/  

        if(this.uploadFile){

    	 	this.allImages.push(

	         	{
	                type:'imageProduct',
	                file: this.uploadFile,
	                folder:this.category,
	                path:'products',
	                width:300,
	                height:300,
	                name: this.urlInput
	            }

	        )

	    }

	    if(this.uploadFileTB){

    	 	this.allImages.push(

	         	{
	                type:'topBannerImg',
	                file: this.uploadFileTB,
	                folder:`${this.category}/top`,
	                path:'products',
	                width:1920,
	                height:80,
	                name: null
	            }

	        )

	    }else{

	    	this.f.controls.top_banner.value[0].IMG_tag = this.nameImageTB;

	    }

	    if(this.uploadFileDB){

    	 	this.allImages.push(

	         	{
	                type:'defaultBannerImg',
	                file: this.uploadFileDB,
	                folder:`${this.category}/default`,
	                path:'products',
	                width:570,
	                height:210,
	                name: null
	            }

	        )

	    }

	     if(this.uploadFileHSlider){

    	 	this.allImages.push(

	         	{
	               	type:'hSliderImg',
                	file: this.uploadFileHSlider,
                	folder:`${this.category}/horizontal`,
                	path:'products',
                	width:1920,
                	height:358,
                	name: null
	            }

	        )

	    }else{

	    	this.f.controls.horizontal_slider.value[0].IMG_tag = this.nameImageHSlider;

	    }

     	if(this.uploadFileVSlider){

    	 	this.allImages.push(

	         	{
		            type:'vSliderImg',
	                file: this.uploadFileVSlider,
	                folder:`${this.category}/vertical`,
	                path:'products',
	                width:263,
	                height:629,
	                name: null
	            }

	        )

	    }


	    const uploadImages = new Promise<void>((resolve, reject)=>{

		    if(this.allImages.length > 0){

	        	this.allImages.forEach((value:any) => {  

		        	this.imagesService.uploadImage(value.file, value.path, value.folder, value.width, value.height, value.name)
		        	.subscribe((resp:any)=>{

		        		if(resp.status == 200){

	        				if(value.type == "imageProduct"){

	    						this.nameImage = resp["result"];
	        			
	        				}

	        				if(value.type == "topBannerImg"){

        						this.imagesService.deleteImage(`products/${this.category}/top/${this.nameImageTB}`)
								.subscribe(

									(resp:any)=>{if(resp.status == 200){}}

								)

								this.f.controls.top_banner.value[0].IMG_tag = resp["result"];

	        				}

	        				if(value.type == "defaultBannerImg"){

	        					this.imagesService.deleteImage(`products/${this.category}/default/${this.nameImageDB}`)
								.subscribe(

									(resp:any)=>{if(resp.status == 200){}}

								)

	    						this.nameImageDB = resp["result"];
	        			
	        				}

        					if(value.type == "hSliderImg"){

        						this.imagesService.deleteImage(`products/${this.category}/horizontal/${this.nameImageHSlider}`)
								.subscribe(

									(resp:any)=>{if(resp.status == 200){}}

								)

								this.f.controls.horizontal_slider.value[0].IMG_tag = resp["result"];

	        				}

	        				if(value.type == "vSliderImg"){

	        					this.imagesService.deleteImage(`products/${this.category}/vertical/${this.nameImageVSlider}`)
								.subscribe(

									(resp:any)=>{if(resp.status == 200){}}

								)

	    						this.nameImageVSlider = resp["result"];
	        			
	        				}

	        				this.countAllImages++

	        				/*=============================================
	                   	 	Preguntamos cuando termina de subir todas las imágenes
	                    	=============================================*/

	                    	if(this.countAllImages == this.allImages.length){

	                    		resolve();

	                    	}

	        			}
		        	})


		        })


	        }else{

	        	resolve();

	        }

	    })

	    await uploadImages;

    	/*=============================================
        Consolidar Galería en el servidor
        =============================================*/

        const uploadGallery = new Promise<void>((resolve, reject)=>{

        	if(this.files.length > 0){

        		this.files.forEach((value)=>{

        			this.imagesService.uploadImage(value, "products", `${this.category}/gallery`, 1000,1000, null)
					.subscribe((resp:any)=>{

						if(resp["status"] == 200){  

							this.gallery = this.editGallery;
							this.gallery.push(resp["result"]);
							this.countGallery++;

							/*=============================================
		                    Preguntamos cuando termina de subir toda la galería
		                    =============================================*/

		                    if(this.countGallery == this.files.length){

	                    		/*=============================================
								Eliminar fotos en el servidor de la galería
								=============================================*/

								this.deleteGallery.forEach((pic:any)=>{

									this.imagesService.deleteImage(`products/${this.category}/gallery/${pic}`)
									.subscribe(

										(resp:any)=>{

											if(resp.status == 200){

												this.countGallery++;

												if(this.countGallery == (this.files.length + this.deleteGallery.length)){

													resolve();

												}
											}

										}


									)

								}) 

		                    }

						}

					})
        		})

        	}else{

        		this.gallery = this.editGallery;
        		resolve();
        	}

        })

        await uploadGallery;

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

			category:this.category,
			date_created:this.date_created,
			default_banner:this.nameImageDB,
			delivery_time:this.f.controls.delivery_time.value,
			description:this.f.controls.description.value,
			details:JSON.stringify(this.details.value),
			feedback:this.feedback,
			gallery:JSON.stringify(this.gallery),
			horizontal_slider:JSON.stringify(this.horizontal_slider.value[0]).replace(/[_]/g," ").replace('H3 1 tag','H3-1 tag').replace('H3 2 tag','H3-2 tag').replace('H3 3 tag','H3-3 tag').replace('H3 4s tag','H3-4s tag'),
			image:this.nameImage,
			name:this.f.controls.name.value,
			offer:this.value_offer.value ?  JSON.stringify([ this.type_offer.value, this.value_offer.value, this.date_offer.value]) : "",
			price:this.f.controls.price.value,
			reviews:this.reviews,
			sales:this.sales,
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
			video:this.id_video.value ? JSON.stringify([ this.type_video.value, this.id_video.value]): "[]",
			views:this.views

		}

		/*=============================================
		Guardar en base de datos la info del producto
		=============================================*/

		this.productsService.patchData(this.idProduct, dataProduct).subscribe(

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

	/*=============================================
	Validamos formulario
	=============================================*/

	invalidField(field:string){

		return functions.invalidField(field, this.f, this.formSubmitted);

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
    Remover fotos de la Galería
    =============================================*/

    removeGallery(pic: string){

    	this.editGallery.splice( this.editGallery.indexOf(pic), 1);
    	this.deleteGallery.push(pic) 	

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

         		this.specifications.removeAt(i);
	      
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
