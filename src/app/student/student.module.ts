import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NzListModule } from 'ng-zorro-antd/list';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzButtonModule  } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { StudentService } from './student.service';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';


@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    ScrollingModule,
    NzListModule,
    NzFormModule,
    NzDrawerModule,
    NzDropDownModule,
    NzSelectModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTabsModule,
    NzModalModule,
    NzSkeletonModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers:[StudentService]
})
export class StudentModule { }
