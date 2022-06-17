import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { SubcategoriesComponent } from './subcategories.component';


const routes: Routes = [
	{ path: '', component: SubcategoriesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcategoriesRoutingModule { }
