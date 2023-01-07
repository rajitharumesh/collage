import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';

import { Course, CourseService } from './course.service';

const count = 5;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit, OnDestroy {
  visible = false;
  drawerTitle = 'Create';
  form!: FormGroup;

  initLoading = true;
  loadingMore = false;
  data: any[] = [];
  list: Course[] = [];

  constructor(
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private courseService: CourseService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.fb.group({
      id: [null],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
  }


  ngOnDestroy(): void {
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
    this.form.setValue({ 'id':item.id,'title': item.title, 'description': item.description });
  }

  delete(item: any) {
    console.log("Delete   ", item);
    this.courseService.delete(item.id)
      .subscribe((data: any) => {
        console.log("Delete  - ", data);
        this.nzMessage.success("Successfully Deleted...!");

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
    console.log('close');
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log('submit', this.form.value);

      if (this.form.value.id) {
        this.courseService.update(this.form.value.id, this.form.value).subscribe((data: any) => {
          console.log("Update  - ", data);
          this.nzMessage.success("Successfully Updated...!");

        }, error => this.nzMessage.error("Updated Failed...!"));
      } else {
        this.courseService.create(this.form.value).subscribe((data: any) => {
          console.log("Delete  - ", data);
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
    this.courseService.show()
      .subscribe((data: any) => {
        this.data = data;
        this.list = data;
        this.initLoading = false;
        console.log("dddd", this.initLoading);
        console.log("11111111111", this.list);
      }, error => console.error(error));
  }

  //--------------------------------------------------------------------
}
