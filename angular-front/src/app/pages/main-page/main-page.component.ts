// main-page.component.ts
import { Component, OnInit }                  from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';
import { InfiniteScrollModule }               from 'ngx-infinite-scroll';
import { MatCardModule }                      from '@angular/material/card';
import { MatCheckboxModule }                  from '@angular/material/checkbox';
import { MatDialogModule, MatDialog }         from '@angular/material/dialog';

import { MediaService }                       from '../../api-calls/getMedia';
import { MediaModel }                         from '../../models/media-model';
import { environment }                        from '../../env';
import { MediaFormComponent } from '../upload-page/media-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    MatCardModule,        // <-- здесь и лежит MatCardActions
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,                             // <-- добавили MatDialogModule
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  
})
export class MainPage implements OnInit {
  mediaList: MediaModel[] = [];
  page = 1;
  limit = 20;
  loading = false;
  hasMore = true;
  username = 'Default';
  env = environment;

  showImages = true;
  showVideos = true;

  constructor(
    private mediaService: MediaService,
    private dialog: MatDialog               // <-- внедрили MatDialog
  ) {}

  ngOnInit() {
    this.loadNext();
  }

  /** Открывает форму загрузки в диалоге */
  openUpload() {
    const dialogRef = this.dialog.open(MediaFormComponent, {
      width: '600px',
      // можно передать данные в форму через data: { … }
    });

    dialogRef.afterClosed().subscribe((newMedia: MediaModel|undefined) => {
    if (newMedia) {
      // Вариант A: просто влезаем в начало массива,
      // чтобы он сразу показался пользователю
      this.mediaList = [newMedia, ...this.mediaList];
    }
  });
  }

  get filteredMedia() {
    return this.mediaList.filter(m =>
      (m.type === 'image' && this.showImages) ||
      (m.type === 'video' && this.showVideos)
    );
  }

  onScroll() {
    if (!this.loading && this.hasMore) {
      this.loadNext();
    }
  }

  loadNext() {
    this.loading = true;
    this.mediaService.getMedia(this.page, this.limit).subscribe(res => {
      this.mediaList = [...this.mediaList, ...res.data];
      this.hasMore   = this.mediaList.length < res.total;
      this.page++;
      this.loading   = false;
    });
  }

  trackById(_: number, item: MediaModel) {
    return item._id;
  }
}
