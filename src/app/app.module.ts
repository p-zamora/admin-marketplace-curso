import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//Modulos Personalizados
import { PagesModule } from './pages/pages.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Vincular el Interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { IntInterceptor } from './interceptor/int.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{

    provide: HTTP_INTERCEPTORS,
    useClass:IntInterceptor,
    multi: true

  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
