import { Component, OnInit, ViewChild } from '@angular/core';
import { Iusers } from 'src/app/interface/iusers';
import { UsersService } from 'src/app/services/users.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { functions } from 'src/app/helpers/functions';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
    animations: [
	    trigger('detailExpand', [
	      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
	    ])
  	]
})
export class UsersComponent implements OnInit {

	/*=============================================
	Variable para nombrar las columnas de nuestra tabla en Angular Material
	=============================================*/
	displayedColumns: string[] = [  'position',  
									'email',
									'actions'];

	/*=============================================
	Variable global que instancie la data que aparecerá en la Tabla
	=============================================*/
	dataSource!:MatTableDataSource<Iusers>;
	
	/*=============================================
	Variable global que tipifica la interfaz de usuario
	=============================================*/

	users:Iusers[] = [];

	/*=============================================
	Variable global que informa a la vista cuando hay una expansión de la tabla
	=============================================*/

	expandedElement!: Iusers | null;
	

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

  	constructor(private usersService: UsersService) { }

  	ngOnInit(): void {

  		this.getData();

  		/*=============================================
		Definir tamaños de pantalla
		=============================================*/

		if(functions.screenSize(0, 767)){

			this.screenSizeSM = true;

		}else{

			this.screenSizeSM = false;

			this.displayedColumns.splice(1, 0, 'displayName');
			this.displayedColumns.splice(2, 0, 'username');
			
		}

  	}

  	/*=============================================
	función para tomar la data de usuarios
	=============================================*/

  	getData(){

  		this.loadData = true;

  		this.usersService.getData().subscribe((resp:any)=>{

  			/*=============================================
			Integrando respuesta de base de datos con la interfaz
			=============================================*/
  			let position = 1;

  			this.users = Object.keys(resp).map(a=> ({
  				
  				id:a,
  				position:position++,
  				address:resp[a].address,
				city:resp[a].city,
				country:resp[a].country,
				country_code:resp[a].country_code,
				displayName:resp[a].displayName,
				email:resp[a].email,
				idToken:resp[a].idToken,
				method:resp[a].method,
				phone:resp[a].phone,
				picture:resp[a].picture,
				username:resp[a].username,
				wishlist:resp[a].wishlist

  			} as Iusers ));

  			this.dataSource = new MatTableDataSource(this.users);	

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

}
