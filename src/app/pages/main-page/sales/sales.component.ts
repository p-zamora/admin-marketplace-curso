import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Isales } from 'src/app/interface/isales';
import { environment } from 'src/environments/environment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { SalesService } from 'src/app/services/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { functions } from 'src/app/helpers/functions';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
      ])
    ]
})
export class SalesComponent implements OnInit {

  /*=============================================
  Variable para nombrar las columnas de nuestra tabla en Angular Material
  =============================================*/
  displayedColumns: string[] = [  'position', 
                                  'id_order',
                                  'actions'];

  /*=============================================
  Variable global que instancie la data que aparecerá en la Tabla
  =============================================*/
  dataSource!:MatTableDataSource<Isales>;

  /*=============================================
  Variable global que tipifica la interfaz de órdenes
  =============================================*/
  sales:Isales[] = [];

   /*=============================================
  Variable global que informa a la vista cuando hay una expansión de la tabla
  =============================================*/
  expandedElement!: Isales | null;

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
  Paginación y orden
  =============================================*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private salesService: SalesService,  private ordersService: OrdersService, public dialog: MatDialog ) { }

  ngOnInit(): void {

      this.getData();

      /*=============================================
      Definir tamaños de pantalla
      =============================================*/

      if(functions.screenSize(0, 767)){

        this.screenSizeSM = true;

      }else{

        this.screenSizeSM = false;

        this.displayedColumns.splice(2, 0, 'unit_price');
        this.displayedColumns.splice(2, 0, 'commission');
        this.displayedColumns.splice(3, 0, 'total');
        
      }
  
  }

  /*=============================================
  función para tomar la data de tiendas
  =============================================*/

  getData(){

      this.loadData = true;

      this.salesService.getData().subscribe((resp:any)=>{

         /*=============================================
        Integrando respuesta de base de datos con la interfaz
        =============================================*/

        let position = 1;

        this.sales = Object.keys(resp).map(a=> ({
          id: a,
          position: position++,
          client: resp[a].client, 
          date: resp[a].date,
          id_order: resp[a].id_order,
          id_payment: resp[a].id_payment,
          payment_method: resp[a].payment_method,
          product: resp[a].product,
          quantity: resp[a].quantity,
          status: resp[a].status,
          unit_price: resp[a].unit_price,
          commission:  resp[a].commission,
          total: resp[a].total,
          url: resp[a].url,
          store:'',
          paid_out:resp[a].paid_out

        } as Isales ));

        /*=============================================
        Traer información de la tienda desde el id de la Orden
        =============================================*/

        this.sales.forEach((value, index)=>{

          this.ordersService.getItem(value.id_order)
          .subscribe(

            (resp:any)=>{

              this.sales[index].store = resp.store;
             
            }

          );

        })
     
        this.dataSource = new MatTableDataSource(this.sales);  

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
