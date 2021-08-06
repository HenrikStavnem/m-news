import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './components/index/index.component';


@NgModule({
	declarations: [
		IndexComponent
	],
	imports: [
		CommonModule,
		IndexRoutingModule
	]
})
export class IndexModule { }