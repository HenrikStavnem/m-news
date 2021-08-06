import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('src/app/modules/routes/index/index.module').then(module => module.IndexModule),
		data: {pageType: 'index'}
	},
	{
		path: 'user',
		loadChildren: () => import('src/app/modules/routes/user/user.module').then(module => module.UserModule),
		data: {pageType: 'user'}
	},
	{
		path: 'user/:id',
		loadChildren: () => import('src/app/modules/routes/user/user.module').then(module => module.UserModule),
		data: {pageType: 'user'}
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
