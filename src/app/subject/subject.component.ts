import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SubjectService, ItemData } from './subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectComponent implements OnInit, OnDestroy {
  ds = new MyDataSource(this.http);
  visible = false;
  drawerTitle = 'Create';
  private destroy$ = new Subject();
  constructor(
    private http: HttpClient,
    private nzMessage: NzMessageService,
    private modal: NzModalService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.ds
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nzMessage.warning('Infinite List loaded all');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  edit(item: any) {
    console.log(item);
    this.visible = true;
    this.drawerTitle = 'Edit';
  }

  delete(item: any) {
    console.log(item);
  }

  open(): void {
    this.visible = true;
    this.drawerTitle = 'Create';
  }

  close(): void {
    this.visible = false;
  }

  showConfirm(item: any): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete these items?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK'),
    });
  }
}
class MyDataSource extends DataSource<ItemData> {
  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(private http: HttpClient) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange
      .pipe(takeUntil(this.complete$), takeUntil(this.disconnect$))
      .subscribe((range) => {
        if (this.cachedData.length >= 50) {
          this.complete$.next();
          this.complete$.complete();
        } else {
          const endPage = this.getPageForIndex(range.end);
          this.fetchPage(endPage + 1);
        }
      });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.http
      .get<{ results: ItemData[] }>(
        `https://randomuser.me/api/?results=${this.pageSize}&inc=name,gender,email,nat&noinfo`
      )
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res) => {
        this.cachedData.splice(
          page * this.pageSize,
          this.pageSize,
          ...res.results
        );
        this.dataStream.next(this.cachedData);
      });
  }
}
