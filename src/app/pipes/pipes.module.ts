import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//pipes
import { JsonToStringPipe } from './json-to-string.pipe';
import { SeparateObjectsPipe } from './separate-objects.pipe';
import { UrlSecurePipe } from './url-secure.pipe';
import { SubstrPipe } from './substr.pipe';

@NgModule({
  declarations: [JsonToStringPipe, SeparateObjectsPipe, UrlSecurePipe, SubstrPipe],
  imports: [
    CommonModule
  ],
  exports:[
	  JsonToStringPipe,
	  SeparateObjectsPipe,
	  UrlSecurePipe,
    SubstrPipe
  ]
})
export class PipesModule { }
