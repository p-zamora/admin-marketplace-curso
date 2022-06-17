import { Component, OnInit, ViewChild } from '@angular/core';
import { Icategories } from 'src/app/interface/icategories';
import { CategoriesService } from 'src/app/services/categories.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';
import { NewCategoriesComponent } from './new-categories/new-categories.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { alerts } from 'src/app/helpers/alerts';
import { SubcategoriesService } from 'src/app/services/subcategories.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
   animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]
})
export class CategoriesComponent implements OnInit {

   /*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	displayedColumns: string[] = [  'position',  
									'name',
									'actions'];

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	dataSource!:MatTableDataSource<Icategories>;
	
	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/

	categories:Icategories[] = [];

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	expandedElement!: Icategories | null;
	

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
	Paginación y orden
	=============================================*/

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

  	constructor(private categoriesService: CategoriesService, public dialog: MatDialog, private subcategoriesService: SubcategoriesService, private imagesService: ImagesService ) { }

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
			this.displayedColumns.splice(3, 0, 'image');
			
		}

  	}

  	/*=============================================
	función para tomar la data de usuarios
	=============================================*/

  	getData(){

  		this.loadData = true;

  		this.categoriesService.getData().subscribe((resp:any)=>{

  			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/
  			let position = Object.keys(resp).length;

  			this.categories = Object.keys(resp).map(a=> ({
  				
  				id:a,
  				position:position--,
  				name:resp[a].name,
				icon:resp[a].icon,
				image:resp[a].image,
				title_list:resp[a].title_list,
				url:resp[a].url,
				view:resp[a].view,
				state:resp[a].state

  			} as Icategories ));

  			this.dataSource = new MatTableDataSource(this.categories);	

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
	newCategory(){

		const dialogRef = this.dialog.open(NewCategoriesComponent,{width:'100%'})

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
	Cambiar estado de la categoría
	=============================================*/

	changeState(e:any){
		
		if(e.target.checked){
			
			const data = {'state':'show'}

			this.categoriesService.patchData(e.target.id.split("_")[1], data)
			.subscribe(

				()=>{
					this.getData();
				}
			
			)

		}else{

			const data = {'state':'hidden'}

			this.categoriesService.patchData(e.target.id.split("_")[1], data)
			.subscribe(

				()=>{
					this.getData();
				}
			
			)

		}

	}

	/*=============================================
	función para llamar el diálogo de edición de categorías
	=============================================*/

	editCategory(id:string){

		const dialogRef = this.dialog.open(EditCategoriesComponent,{

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
	función para eliminar la categoría
	=============================================*/

	deleteCategory(id:string, name:string, image:string){

		alerts.confirmAlert('Are you sure?', 'The information cannot be recovered!', 'warning','Yes, delete it!')
		.then((result) => {
			
			if (result.isConfirmed) {

				/*=============================================
				Validar que la categoría no tenga subcategoría asociada
				=============================================*/
				this.subcategoriesService.getFilterData("category", name)
				.subscribe(

					(resp:any)=>{

						if ( Object.keys(resp).length > 0 ){

							alerts.basicAlert('error','The category has related sub categories','error')

						}else{

							/*=============================================
							Eliminar imagen de la categoría del servidor
							=============================================*/

							this.imagesService.deleteImage(`categories/${image}`)
							.subscribe(

								(resp:any)=>{

									if(resp.status == 200){

										/*=============================================
										Eliminar registro de la base de datos
										=============================================*/

										this.categoriesService.deleteData(id)
										.subscribe(

											()=>{

												alerts.basicAlert("Success", 'The category has been successfully removed', "success")

												this.getData();

											}
										)

									}else{

										alerts.basicAlert("Error", 'Error while deleting the file', "error")

									}

								}
							)						

						}

					}

				)

			}

		})

	}


}
