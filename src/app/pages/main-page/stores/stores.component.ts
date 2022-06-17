import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Istores } from 'src/app/interface/istores';
import { environment } from 'src/environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { StoresService } from 'src/app/services/stores.service';
import { MatDialog } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { EditStoresComponent } from './edit-stores/edit-stores.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css'],
  animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]
})
export class StoresComponent implements OnInit {

	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	displayedColumns: string[] = [  'position',  
									'store',
									'actions'];

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	dataSource!:MatTableDataSource<Istores>;

	/*=============================================
	Variable global que tipifica la interfaz de tiendas
	=============================================*/
	stores:Istores[] = [];

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	expandedElement!: Istores | null;

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

	constructor(private storesService: StoresService, public dialog: MatDialog ) { }

	ngOnInit(): void {

  		this.getData();

  		/*=============================================
		Definir tamaños de pantalla
		=============================================*/

		if(functions.screenSize(0, 767)){

			this.screenSizeSM = true;

		}else{

			this.screenSizeSM = false;

			this.displayedColumns.splice(2, 0, 'logo');
			this.displayedColumns.splice(3, 0, 'username');
			
		}

  	}

	/*=============================================
	función para tomar la data de tiendas
	=============================================*/

  	getData(){

  		this.loadData = true;

  		this.storesService.getData().subscribe((resp:any)=>{

			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/

  			let position = 1;

  			this.stores = Object.keys(resp).map(a=> ({

  				id: a,
  				position: position++,
  				about: resp[a].about,
				abstract: resp[a].abstract,
				address: resp[a].address,
				city: resp[a].city,
				country: resp[a].country,
				cover: resp[a].cover,
				date:resp[a].date,
				email: resp[a].email,
				logo: resp[a].logo,
				phone: resp[a].phone,
				products: resp[a].products,
				social: resp[a].social,
			    store: resp[a].store,
			    url: resp[a].url,
			    username: resp[a].username

  			} as Istores ));

  			this.dataSource = new MatTableDataSource(this.stores);	

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
	función para llamar el diálogo de edición de categorías
	=============================================*/

	editStore(id:string){

		const dialogRef = this.dialog.open(EditStoresComponent,{
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

}
