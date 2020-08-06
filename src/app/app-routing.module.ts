import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

const home: Route = {
  path: '',
  component: HomeComponent
}

const routes: Routes = [
  home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
