import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { SubjectService } from './subject.service';
import { SharedService, Subject } from '../shared/shared.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectComponent implements OnInit, OnDestroy {
  visible = false;
  drawerTitle = 'Create';
  form !: UntypedFormGroup;

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Subject[] = [];

  constructor(
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private subjectService: SubjectService,
    private fb: UntypedFormBuilder,private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.fb.group({
      id: [null],
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

  }

  ngOnDestroy(): void {
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    this.form.setValue({ 'id':item.id,'name': item.name, 'description': item.description });
  }

  delete(item: any) {
    console.log("Delete   ", item);
    this.subjectService.delete(item.id)
      .subscribe((data: any) => {
        console.log("Delete  - ", data);
        this.nzMessage.success("Successfully Deleted...!");
        this.getData();
      }, error => this.nzMessage.error("Delete Failed...!"));
  }

  async open(): Promise<void> {
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
        this.subjectService.update(this.form.value).subscribe((data: any) => {
          console.log("Update  - ", data);
          this.getData();
          this.nzMessage.success("Successfully Updated...!");

        }, error => this.nzMessage.error("Updated Failed...!"));
      } else {
        this.subjectService.create(this.form.value).subscribe((data: any) => {
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
    this.getData();
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
    this.sharedService.getSubject()
      .subscribe((data: any) => {
        this.data = data;
        this.list = data;
        this.initLoading = false;
        console.log("dddd", this.initLoading);
        console.log("11111111111", this.list);
      }, error => console.error(error));
  }
}