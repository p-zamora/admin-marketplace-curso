import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Iproducts } from 'src/app/interface/iproducts';
import { ProductsService } from 'src/app/services/products.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';
import { ApproveProductComponent } from './approve-product/approve-product.component';
import { alerts } from 'src/app/helpers/alerts';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  	selector: 'app-products',
  	templateUrl: './products.component.html',
 	styleUrls: ['./products.component.css'],
  	animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]
})
export class ProductsComponent implements OnInit {

	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	displayedColumns: string[] = [  'position',  
									'name',
									'actions'];

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	dataSource!:MatTableDataSource<Iproducts>;	

	/*=============================================
	Variable global que tipifica la interfaz de productos
	=============================================*/

	products:Iproducts[] = [];	

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	expandedElement!: Iproducts | null;

	/*=============================================
	Variable global que captura la ruta de los archivos de imagen
	=============================================*/

	path = environment.urlFiles;	

	/*=============================================
	Variable global para definir tamaños de pantalla
	=============================================*/

	screenSizeSM = false;	

	/*=============================================
	Variable global para saber cuando finaliza la carga de los datos
	=============================================*/
	loadData = false;

	/*=============================================
	Variable global para almacenar el nombre de la tienda del MP
	=============================================*/

	nameStore = environment.nameStore;

	/*=============================================
	Paginación y orden
	=============================================*/

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
				

	constructor(private productsService: ProductsService, public dialog: MatDialog, private imagesService: ImagesService  ) { }

	ngOnInit(): void {

		this.getData();

		/*=============================================
		Definir tamaños de pantalla
		=============================================*/

		if(functions.screenSize(0, 767)){

			this.screenSizeSM = true;

		}else{

			this.screenSizeSM = false;

			this.displayedColumns.splice(2, 0, 'image');
			this.displayedColumns.splice(3, 0, 'store');
			
		}
	}

	/*=============================================
	función para tomar la data de productos
	=============================================*/

	getData(){

		this.loadData = true;

		this.productsService.getData()
		.subscribe((resp?:any)=>{

			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/
			let position = Object.keys(resp).length;

			this.products = Object.keys(resp).map(a=> 

  				({
  		
	  				id:a,
	  				position:position--,
					category: resp[a].category,
		            date_created: resp[a].date_created,
		            default_banner: resp[a].default_banner,
		            delivery_time:resp[a].delivery_time,
		            description:resp[a].description,
		            details:JSON.parse(resp[a].details),
		            feedback:JSON.parse(resp[a].feedback),
		            gallery:JSON.parse(resp[a].gallery),
		            horizontal_slider:JSON.parse(resp[a].horizontal_slider),
		            image:resp[a].image,
		            name:resp[a].name,
		            offer:resp[a].offer,
		            price:resp[a].price,
		            reviews:JSON.parse(resp[a].reviews),
		            sales:resp[a].sales,
		            shipping:resp[a].shipping,
		            specification:resp[a].specification?JSON.parse(resp[a].specification):[],
		            stock:resp[a].stock,
		            store:resp[a].store,
		            sub_category:resp[a].sub_category,
		            summary:JSON.parse(resp[a].summary),
		            tags:resp[a].tags,
		            title_list:resp[a].title_list,
		            top_banner:JSON.parse(resp[a].top_banner),
		            url:resp[a].url,
		            vertical_slider:resp[a].vertical_slider,
		            video:JSON.parse(resp[a].video),
		            views:resp[a].views    

	  			} as Iproducts )

  			);


  			this.dataSource = new MatTableDataSource(this.products);

  			this.dataSource.paginator = this.paginator;	

  			this.dataSource.sort = this.sort;

  			this.loadData = false;	

  			/*=============================================
  			Configuración de las reseñas
  			=============================================*/

  			for(const i in this.products){

  				/*=============================================
  				Función para promediar las reseñas
  				=============================================*/

  				this.configReviews(this.products[i].reviews, i);

  			}

		})

	}

	/*=============================================
	Filtro de Búsqueda
	=============================================*/

	applyFilter(event: Event) {
	    const filterValue = (event.target as HTMLInputElement).value;
	    this.dataSource.filter = filterValue.trim().toLowerCase();

     	if (this.dataSource.paginator) {
      		this.dataSource.paginator.firstPage();
    	}
  	}

  	/*=============================================
	Función para promediar las reseñas
	=============================================*/

	configReviews(data:any, index:any){

		let arrayReviews = []

		if(data.length > 0){

			let totalReview = 0;
			let promReview = 0;

			for(const i in data){

				totalReview += Number(data[i].review);

			}

			promReview = Math.round(totalReview / data.length);

			for(let i = 1; i <= 5; i++){

				if(i > promReview){

					arrayReviews[i-1] = 2;

				}else{

					arrayReviews[i-1] = 1;
				}

			}

			this.products[index].reviews = arrayReviews;

		}

	}

	/*=============================================
	función para llamar el diálogo de aprobación de productos
	=============================================*/

	approveProduct(id:string){

		const dialogRef = this.dialog.open(ApproveProductComponent,{
			data: {
				id: id
			}

		})

		/*=============================================
		Actualizar el listado de la tabla
		=============================================*/

		dialogRef.afterClosed().subscribe(result =>{

			if(result){

				this.getData();

			}

		})

	}

	/*=============================================
	función para eliminar el producto
	=============================================*/

	deleteProduct(id:string, category:string, image:string, gallery:any, db:string, tb:string, hs:string, vs:string){

		alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
		.then((result) => {

			if (result.isConfirmed) {

				let jsonDelete = [

					`products/${category}/${image}`,
					`products/${category}/default/${db}`,
					`products/${category}/top/${tb}`,
					`products/${category}/horizontal/${hs}`,
					`products/${category}/vertical/${vs}`,

				]

				gallery.forEach((pic:any)=>{
					
					jsonDelete.push(`products/${category}/gallery/${pic}`);

				})

				let countDelete = 0;

				jsonDelete.forEach((img:any)=>{

					/*=============================================
					Eliminar imagenes de los productos en el servidor
					=============================================*/

					this.imagesService.deleteImage(img)
					.subscribe(

							(resp:any)=>{

								if(resp.status == 200){

									countDelete++

									if(countDelete == jsonDelete.length){

										/*=============================================
										Eliminar registro de la base de datos
										=============================================*/

										this.productsService.deleteData(id)
										.subscribe(

											()=>{

												alerts.basicAlert("Success", 'The product has been successfully removed', "success")

												this.getData();

											}
										)
									}
								}

							}

					)


				})

				



			}

		})

	}


}
