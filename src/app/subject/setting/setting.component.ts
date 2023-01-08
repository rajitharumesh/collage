import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Course, SharedService, Student, Subject, Teacher } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  form!: FormGroup;

  selectedCourse = "";
  selectedSubject = "";
  selectedStudent = "";
  selectedTeacher="";

  initLoading = true;
  data: any[] = [];
  courseList: Course[] = [];
  studentList: Student[] = [];
  subjectList: Subject[] = [];
  teacherList: Teacher[] = [];

  constructor(private nzMessage: NzMessageService,
    private fb: UntypedFormBuilder, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      course: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      teacher: ["", [Validators.required]],
      student: ["", [Validators.required]],
    });

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

  courseChange(item: any) {

  }

  save() {

  }

}
