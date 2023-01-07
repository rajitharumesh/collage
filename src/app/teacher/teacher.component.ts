import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Teacher, TeacherService } from './teacher.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherComponent implements OnInit, OnDestroy {
  visible = false;
  drawerTitle = 'Create';
  form !: UntypedFormGroup;

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Teacher[] = [];

  constructor(
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private teacherService: TeacherService,
    private fb: UntypedFormBuilder, private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.fb.group({
      id: [null],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      birthDate: ["", [Validators.required]],
      salary: ["", [Validators.required]],
    });
  }

  ngOnDestroy(): void {
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    this.form.setValue({ 'id': item.id, 'firstName': item.firstName, 'lastName': item.lastName, 'salary': item.salary, "birthDate": item.birthDate })
  }

  delete(item: any) {
    console.log("Delete   ", item);
    this.teacherService.delete(item.id)
      .subscribe((data: any) => {
        console.log("Delete  - ", data);
        this.nzMessage.success("Successfully Deleted...!");
        this.getData();
      }, error => this.nzMessage.error("Delete Failed...!"));
  }

  open(): void {
    this.visible = true;
    this.drawerTitle = 'Create';
    console.log('open');
    this.form.reset();
  }

  close(): void {
    this.visible = false;
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log('submit', this.form.value);

      if (this.form.value.id) {
        this.teacherService.update(this.form.value).subscribe((data: any) => {
          console.log("Update  - ", data);
          this.getData();
          this.nzMessage.success("Successfully Updated...!");

        }, error => this.nzMessage.error("Updated Failed...!"));
      } else {
        this.teacherService.create(this.form.value).subscribe((data: any) => {
          console.log("Delete  - ", data);
          this.getData();
          this.nzMessage.success("Successfully Created...!");
        }, error => this.nzMessage.error("Created Failed...!"));
      }

    } else {
      console.log('error ', this.form.value);
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  showConfirm(item: any): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete these items?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.delete(item),
    });
  }

  //-------------------------------------------------------------------

  getData(): void {
    this.sharedService.getTeacher()
      .subscribe((data: any) => {
        this.data = data;
        this.list = data;
        this.initLoading = false;
        console.log("dddd", this.initLoading);
        console.log("11111111111", this.list);
      }, error => console.error(error));
  }
}