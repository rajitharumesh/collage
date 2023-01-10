import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { StudentService } from './student.service';
import { Course, SharedService, Student, Subject, Teacher } from '../shared/shared.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentComponent implements OnInit, OnDestroy {
  visible = false;
  drawerTitle = 'Create';


  form = new FormGroup({
    id: new FormControl(0),
    lastName: new FormControl(''),
    firstName: new FormControl(''),
    registrationNo: new FormControl(''),
    birthDate: new FormControl(''),
    studentId: new FormControl(0),
    courseId: new FormControl(0),
    teacherId: new FormControl(0),
    subjectId: new FormControl(0),
    courseSubjectId: new FormControl(0),
    grade: new FormControl(0),
  });

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Student[] = [];

  courseList: Course[] = [];
  subjectList: Subject[] = [];
  teacherList: Teacher[] = [];

  constructor(
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private studentService: StudentService,
    private fb: UntypedFormBuilder, private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.fb.group({
      id: [null],
      lastName: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      birthDate: ["", [Validators.required]],
      registrationNo: ["", [Validators.required]],
      courseId: [0],
      teacherId: [0],
      subjectId: [0],
      studentId: [0],
      courseSubjectId: [0],
      grade: [0]
    });
    this.getCourse();
    this.getSubjectByCourseId();
    this.GetTeacherBySubjectId();
  }

  ngOnDestroy(): void {
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    this.form.setValue({
      'id': item.id, 'lastName': item.lastName, 'firstName': item.firstName,
      'birthDate': item.birthDate, 'registrationNo': item.registrationNo,
      'subjectId': item.subjectID ?? 0, 'courseId': item.courseID ?? 0, 'teacherId': item.teacherID ?? 0,
      'studentId': item.studentID ?? 0, 'courseSubjectId': item.courseSubjectID ?? 0, 'grade': item.grade ?? 0
    });
  }

  delete(item: any) {
    console.log("Delete   ", item);
    this.studentService.delete(item.id)
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
        this.studentService.update(this.form.value).subscribe((data: any) => {
          console.log("Update  - ", data);
          this.getData();
          this.nzMessage.success("Successfully Updated...!");

        }, error => this.nzMessage.error("Updated Failed...!"));
      } else {
        this.studentService.create(this.form.value).subscribe((data: any) => {
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
    this.sharedService.getStudent()
      .subscribe((data: any) => {
        this.data = data;
        this.list = data;
        this.initLoading = false;
      }, error => console.error(error));
  }

  getCourse(): void {
    this.sharedService.getCourse()
      .subscribe((data: any) => {
        this.courseList = data;
      }, error => console.error(error));
  }

  getSubjectByCourseId(): void {
    this.sharedService.getSubjectByCourseId(1)
      .subscribe((data: any) => {
        this.subjectList = data;
      }, error => console.error(error));
  }

  GetTeacherBySubjectId(): void {
    this.sharedService.GetTeacherBySubjectId(9)
      .subscribe((data: any) => {
        this.teacherList = data;
      }, error => console.error(error));
  }
}
