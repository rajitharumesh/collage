import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Course, Student, Subject, Teacher } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  form!: FormGroup;

  initLoading = true;
  data: any[] = [];
  courseList: Course[] = [];
  studentList: Student[] = [];
  subjectList: Subject[] = [];
  teacherList: Teacher[] = [];
  
  constructor(private nzMessage: NzMessageService,
    private fb: UntypedFormBuilder,) { }

    ngOnInit(): void {
      this.form = this.fb.group({
        id: [null],
        title: ["", [Validators.required]],
        description: ["", [Validators.required]],
      });
    }
}
