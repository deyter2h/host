// src/app/main-page/main-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MediaService } from '../services/media.service';
import { MediaDto } from '../models/media.dto';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from '../../environment';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollModule,
    ScrollingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [MediaService, DatePipe]
})
export class MainPageComponent implements OnInit {
  media$ = new BehaviorSubject<MediaDto[]>([]);
  page = 1;
  limit = 12;
  total = 0;
  loading = false;
  environment = environment;

  constructor(
    private mediaService: MediaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    if (this.loading) return;
    if (this.total && this.media$.value.length >= this.total) return;
    this.loading = true;
    this.mediaService.getMedia(this.page, this.limit).subscribe(res => {
      this.media$.next([...this.media$.value, ...res.data]);
      this.total = res.total;
      this.page++;
      this.loading = false;
    });
  }

  trackById(_: number, item: MediaDto) {
    return item._id;
  }

  trackByCategory(_: number, category: string) {
    return category;
  }

  onIndex(index: number) {
    // load more when nearing end
    if (index + 8 > this.media$.value.length && !this.loading) {
      this.loadMedia();
    }
  }

  formatDate(iso: string) {
    return this.datePipe.transform(iso, 'mediumDate');
  }
}