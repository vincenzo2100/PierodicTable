import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementTable } from './element-table/element-table';

const routes: Routes = [
  { path: '', component: ElementTable },
   { path: '**', component: ElementTable },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
