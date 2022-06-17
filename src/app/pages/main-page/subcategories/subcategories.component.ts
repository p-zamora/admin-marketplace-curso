import { Component, OnInit, ViewChild } from '@angular/core';
import { Isubcategories } from 'src/app/interface/isubcategories';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';
import { NewSubcategoriesComponent } from './new-subcategories/new-subcategories.component';
import { EditSubcategoriesComponent } from './edit-subcategories/edit-subcategories.component';
import { alerts } from 'src/app/helpers/alerts';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  	selector: 'app-subcategories',
  	templateUrl: './subcategories.component.html',
  	styleUrls: ['./subcategories.component.css'],
    animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]
})
export class SubcategoriesComponent implements OnInit {

	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	displayedColumns: string[] = [  'position',  
									'name',
									'actions'];

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	dataSource!:MatTableDataSource<Isubcategories>;
	
	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/

	subcategories:Isubcategories[] = [];

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	expandedElement!: Isubcategories | null;

	/*=============================================
	Variable global para definir tamaños de pantalla
	=============================================*/

	screenSizeSM = false;

	/*=============================================
	Variable global para saber cuando finaliza la carga de los datos
	=============================================*/
	loadData = false;

	/*=============================================
	Paginación y orden
	=============================================*/

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private subcategoriesService: SubcategoriesService, public dialog: MatDialog, private productsService: ProductsService) { }

	ngOnInit(): void {

  		this.getData();

  		/*=============================================
		Definir tamaños de pantalla
		=============================================*/

		if(functions.screenSize(0, 767)){

			this.screenSizeSM = true;

		}else{

			this.screenSizeSM = false;

			this.displayedColumns.splice(2, 0, 'url');
			this.displayedColumns.splice(3, 0, 'category');
			
		}

  	}

  	/*=============================================
	función para tomar la data de usuarios
	=============================================*/

  	getData(){

  		this.loadData = true;

  		this.subcategoriesService.getData().subscribe((resp:any)=>{

  			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/
  			let position = Object.keys(resp).length;

  			this.subcategories = Object.keys(resp).map(a=> ({

  				id:a,
  				position:position--,
  				category:resp[a].category,
  				name:resp[a].name,
				products_inventory: resp[a].products_inventory,
				title_list:resp[a].title_list,
				url:resp[a].url,
				view:resp[a].view

  			} as Isubcategories ));

  			this.dataSource = new MatTableDataSource(this.subcategories);	

  			this.dataSource.paginator = this.paginator;	

  			this.dataSource.sort = this.sort;

  			this.loadData = false;

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
	función para llamar el diálogo de creación de categorías
	=============================================*/
	
	newSubCategory(){

		const dialogRef = this.dialog.open(NewSubcategoriesComponent,{width:'100%'})

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
	función para llamar el diálogo de edición de categorías
	=============================================*/

	editSubCategory(id:string){

		const dialogRef = this.dialog.open(EditSubcategoriesComponent,{

			width:'100%',
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
	función para eliminar la subcategoría
	=============================================*/

	deleteSubCategory(id:string, url:string){	
		
		alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
		.then((result) => {

			if (result.isConfirmed) {

				this.productsService.getFilterData("sub_category", url)
				.subscribe(

					(resp:any)=>{

						if ( Object.keys(resp).length > 0 ){

							alerts.basicAlert('error','The Subcategory has related products','error')

						}else{

							/*=============================================
							Eliminar registro de la base de datos
							=============================================*/

							this.subcategoriesService.deleteData(id)
							.subscribe(

								()=>{

									alerts.basicAlert("Success", 'The subcategory has been successfully removed', "success")

									this.getData();

								}
							)

						}

					}

				)
			}

		})

	}

}
