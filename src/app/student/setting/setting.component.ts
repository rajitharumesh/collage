import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Course, SharedService, Student, Subject, Teacher } from 'src/app/shared/shared.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  visible = false;
  drawerTitle = 'Create';

  form = new FormGroup({
    id: new FormControl(0),
    studentId: new FormControl(0),
    courseId: new FormControl(0),
    teacherId: new FormControl(0),
    subjectId: new FormControl(0),
    courseSubjectId: new FormControl(0),
    grade: new FormControl(0),
  });

  selectedCourse = "";
  selectedSubject = "";
  selectedStudent = "";
  selectedTeacher = "";

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Student[] = [];

  courseList: Course[] = [];
  studentList: Student[] = [];
  subjectList: Subject[] = [];
  teacherList: Teacher[] = [];

  constructor(private nzMessage: NzMessageService,
    private modal: NzModalService,
    private fb: UntypedFormBuilder, private sharedService: SharedService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      studentId: ["", [Validators.required]],
      courseId: ["", [Validators.required]],
      teacherId: ["", [Validators.required]],
      subjectId: ["", [Validators.required]],
      courseSubjectId: [""],
      grade: [""],
    });
    this.getData();
    this.sharedService.getCourse()
      .subscribe((data: any) => {
        this.data = data;
        this.courseList = data;
        this.initLoading = false;
      }, error => console.error(error));
    this.sharedService.getSubject().subscribe((data: any) => {
      this.data = data;
      this.subjectList = data;
      this.initLoading = false;
    }, error => console.error(error));
    this.sharedService.getTeacher().subscribe((data: any) => {
      this.data = data;
      this.teacherList = data;
      this.initLoading = false;
    }, error => console.error(error));
    this.sharedService.getStudent().subscribe((data: any) => {
      this.data = data;
      this.studentList = data;
      this.initLoading = false;
    }, error => console.error(error));

  }

  
  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    // this.form.setValue({
    //   'id': item.id, 'firstName': item.firstName,
    //   'birthDate': item.birthDate, 'registrationNo': item.registrationNo,
    //   'subjectId': item.subjectID ?? 0, 'courseId': item.courseID ?? 0, 'teacherId': item.teacherID ?? 0,
    //   'studentId': item.studentID ?? 0, 'courseSubjectId': item.courseSubjectID ?? 0, 'grade': item.grade ?? 0
    // });
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
        this.studentService.updateMapping(this.form.value).subscribe((data: any) => {
          console.log("Update  - ", data);
          this.getData();
          this.nzMessage.success("Successfully Updated...!");

        }, error => this.nzMessage.error("Updated Failed...!"));
      } else {
        this.studentService.createMapping(this.form.value).subscribe((data: any) => {
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

  getData(): void {
    this.studentService.getAllStudent()
      .subscribe((data: any) => {
        this.data = data;
        this.list = data;
        this.initLoading = false;
      }, error => console.error(error));
  }

  //-------------------------------------------------------------------

  courseChange(item: any) {

  }

  save() {

  }

}
