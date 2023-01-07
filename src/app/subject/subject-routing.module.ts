import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { SubjectComponent } from './subject.component';

const routes: Routes = [{ path: '', component: SubjectComponent },
{ path: 'settings', component: SettingComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
