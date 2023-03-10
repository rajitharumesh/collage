import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { SubjectService } from './subject.service';
import { Course, SharedService, Subject, Teacher } from '../shared/shared.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectComponent implements OnInit, OnDestroy {
  visible = false;
  drawerTitle = 'Create';
  // form !: UntypedFormGroup;

  form = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    description: new FormControl(''),
    courseId: new FormControl(0),
    teacherId: new FormControl(0),
    subjectId: new FormControl(0),
  });

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Subject[] = [];

  courseList: Course[] = [];
  teacherList: Teacher[] = [];

  constructor(
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private subjectService: SubjectService,
    private fb: UntypedFormBuilder, private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.fb.group({
      id: [null],
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      courseId: [0],
      teacherId: [0],
      subjectId: [0],
    });
    this.sharedService.getCourse()
      .subscribe((data: any) => {
        this.data = data;
        this.courseList = data;
        this.initLoading = false;
      }, error => console.error(error));
    this.sharedService.getTeacher().subscribe((data: any) => {
      this.data = data;
      this.teacherList = data;
      this.initLoading = false;
    }, error => console.error(error));
  }

  ngOnDestroy(): void {
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    this.form.setValue({
      'id': item.id, 'name': item.name, 'description': item.description,
      'courseId': item.courseID ?? 0, 'subjectId': item.subjectID ?? 0, 'teacherId': item.teacherID ?? 0//,
    });

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
        this.form.value.id = 0;
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