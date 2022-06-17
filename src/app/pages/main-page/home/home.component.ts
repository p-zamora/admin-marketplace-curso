import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { StoresService } from 'src/app/services/stores.service';
import { SalesService } from 'src/app/services/sales.service';
import { UsersService } from 'src/app/services/users.service';
import { functions } from 'src/app/helpers/functions';
import { OrdersService } from 'src/app/services/orders.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /*=============================================
  Variables globales para definir el inventario de productos
  =============================================*/

  products = 0;
  loadProducts = false;
  latestProducts:any = [];

  /*=============================================
  Variable globales para definir el inventario de tiendas
  =============================================*/
  stores = 0;
  loadStores = false;

   /*=============================================
  Variable globales para definir el inventario de ventas
  =============================================*/
  sales = 0;
  loadSales = false;

  /*=============================================
  Variable globales para definir el inventario de usuarios
  =============================================*/
  users = 0;
  loadUsers = false;

  /*=============================================
  ANGULAR GOOGLE CHARTS https://github.com/FERNman/angular-google-charts
  =============================================*/

  chart:any = {

    type:"AreaChart",
    data:  [],
    columnNames:[ 'Date' ,  'Total' ],
    options:{
      colors: ['#FFC107']
    }
  
  }

  totalSales = 0;

  /*=============================================
  RANGOS DE FECHAS
  =============================================*/

  startDate = new Date(new Date().getFullYear(), 0, 1);// Se trae todo lo del año actual
  endDate = new Date();

  /*=============================================
  Últimas órdenes
  =============================================*/
  loadOrders = false;
  latestOrders:any = [];

  /*=============================================
  Variable global que captura la ruta de los archivos de imagen
  =============================================*/

  path = environment.urlFiles; 
 
  /*=============================================
  Variable global que captura la ruta del marketplace público
  =============================================*/
  domainMP = environment.domainMP; 
 
  constructor(private productsService: ProductsService, 
    private storesService: StoresService, 
    private salesService: SalesService, 
    private usersService: UsersService,
    private ordersService: OrdersService) { }

  ngOnInit(): void {

    this.getProducts();
    this.getStores();
    this.getSales();
    this.getUsers();
    this.lastOrders();

  }

  /*=============================================
  Inventario de productos
  =============================================*/

  getProducts(){

    this.loadProducts = true;

    this.productsService.getData()
      .subscribe((resp?:any)=>{

      this.products = Object.keys(resp).length; 

      /*=============================================
      Traer los últimos 5 productos
      =============================================*/

      this.productsService.getLatestData()
      .subscribe((resp?:any)=>{

         this.latestProducts = Object.keys(resp).map( (a) => ({

            "name":resp[a].name,
            "url":resp[a].url,
            "category":resp[a].category,
            "image":resp[a].image,
            "price":resp[a].price,
            "store":resp[a].store

          }))

      })


      this.loadProducts = false; 



    })

  }

  /*=============================================
  Inventario de tiendas
  =============================================*/

  getStores(){

    this.loadStores = true;

    this.storesService.getData()
    .subscribe((resp?:any)=>{

      this.stores = Object.keys(resp).length;
      this.loadStores = false;

    })

  }

  /*=============================================
  Inventario de ventas
  =============================================*/

  getSales(){

     this.loadSales = true;
     this.chart.data = [];

      /*=============================================
      Total ventas
      =============================================*/

      this.salesService.getData()
      .subscribe((resp?:any)=>{

        this.sales = Object.keys(resp).length;
         this.loadSales = false;

      })

      /*=============================================
      Filtrar ventas por fechas
      =============================================*/

      this.salesService.getDataByDate(functions.formatDate(this.startDate), functions.formatDate(this.endDate))
      .subscribe((resp?:any)=>{
        
        /*=============================================
         Separar mes y total
        =============================================*/

        let sales:any = [];

        Object.keys(resp).map((a, i)=>{ 

          if(resp[a].status == "success"){

            sales[i] = {
             
              date: resp[a].date.substring(0,7),
              total: Number(resp[a].commission)

            }

          }

        })

         /*=============================================
        Ordenar de menor a mayor las fechas
        =============================================*/

        sales.sort((a:any, b:any) => {
        
          
            
            if(a.date < b.date) return -1;
            if(a.date > b.date) return 1;

            return 0;
        })

        /*=============================================
        Sumar total en mes repetido
        =============================================*/

        let result = sales.reduce((r:any,o:any)=>( r[o.date] ? (r[o.date].total += o.total):(r[o.date] = {...o}), r), {})
        
        /*=============================================
        Agregar el arreglo a la data del gráfico
        =============================================*/

        Object.keys(result).map( (a) => {

          const data = [ result[a].date, result[a].total];

          this.chart.data.push(data);

        })

         /*=============================================
        Sumar el total  de ventas
        =============================================*/

        this.chart.data.forEach((value:any)=>{

          this.totalSales += value[1]

        })

      })



  }

  /*=============================================
  Inventario de usuarios
  =============================================*/

  getUsers(){

    this.loadUsers = true;

    this.usersService.getData()
    .subscribe((resp?:any)=>{

      this.users = Object.keys(resp).length;
      this.loadUsers = false;

    })

  }

  /*=============================================
  Traer las últimas Órdenes
  =============================================*/

  lastOrders(){

    /*=============================================
    Traer las últimas 5 ventas
    =============================================*/

    this.salesService.getLatestData()
    .subscribe((resp?:any)=>{
      
      Object.keys(resp).map( (a, i) => {

        this.latestOrders[i] = {}

        /*=============================================
        Traer las últimas 5 órdenes
        =============================================*/

         this.ordersService.getItem(resp[a].id_order)
         .subscribe((resp2?:any)=>{
           

            this.latestOrders[i] = {
              "id":a,
              "product":resp2.product,
              "status":resp2.status,
              "date":resp[a].date
            }



         })

      })

    })

  }

}
