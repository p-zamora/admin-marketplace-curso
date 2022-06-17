import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Iorders } from 'src/app/interface/iorders';
import { environment } from 'src/environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { OrdersService } from 'src/app/services/orders.service';
import { functions } from 'src/app/helpers/functions';
import { MatDialog } from '@angular/material/dialog';
import { EditOrdersComponent } from './edit-orders/edit-orders.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
      ])
    ]
})
export class OrdersComponent implements OnInit {

  /*=============================================
  Variable para nombrar las columnas de nuestra tabla en Angular Material
  =============================================*/
  displayedColumns: string[] = [  'position', 
                                  'status',
                                  'actions'];

  /*=============================================
  Variable global que instancie la data que aparecerá en la Tabla
  =============================================*/
  dataSource!:MatTableDataSource<Iorders>;

  /*=============================================
  Variable global que tipifica la interfaz de órdenes
  =============================================*/
  orders:Iorders[] = [];

   /*=============================================
  Variable global que informa a la vista cuando hay una expansión de la tabla
  =============================================*/
  expandedElement!: Iorders | null;

  /*=============================================
  Variable global que captura la ruta de los archivos de imagen
  =============================================*/
  path = environment.urlFiles;

   /*=============================================
  Variable global que captura la ruta del marketplace público
  =============================================*/
  domainMP = environment.domainMP;

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

  constructor(private ordersService: OrdersService, public dialog: MatDialog  ) { }

  ngOnInit(): void {

      this.getData();

      /*=============================================
      Definir tamaños de pantalla
      =============================================*/

      if(functions.screenSize(0, 767)){

        this.screenSizeSM = true;

      }else{

        this.screenSizeSM = false;

        this.displayedColumns.splice(2, 0, 'id');
        this.displayedColumns.splice(2, 0, 'product');
        this.displayedColumns.splice(3, 0, 'quantity');
        
      }
  
  }

  /*=============================================
  función para tomar la data de tiendas
  =============================================*/

  getData(){

      this.loadData = true;

      this.ordersService.getData().subscribe((resp:any)=>{

         /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/

        let position = 1;

        this.orders = Object.keys(resp).map(a=> ({
          id: a,
          position: position++,
          address : resp[a].address,
          category : resp[a].category,
          city : resp[a].city,
          country : resp[a].country,
          details : resp[a].details,
          email : resp[a].email,
          image : resp[a].image,
          info : resp[a].info,
          phone : resp[a].phone,
          price : resp[a].price,
          process :JSON.parse(resp[a].process),
          product : resp[a].product,
          quantity : resp[a].quantity,
          status : resp[a].status,
          store : resp[a].store,
          url : resp[a].url,
          user : resp[a].user
        } as Iorders ));

        this.dataSource = new MatTableDataSource(this.orders);  

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
  función para llamar el diálogo de edición de órdenes
  =============================================*/

  editOrder(id:string){

    const dialogRef = this.dialog.open(EditOrdersComponent,{
      width:'70%',
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
