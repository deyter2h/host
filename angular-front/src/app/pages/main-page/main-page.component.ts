import { Component, OnInit }                  from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';
import { InfiniteScrollModule }               from 'ngx-infinite-scroll';
import { MatCardModule }                      from '@angular/material/card';
import { MatCheckboxModule }                  from '@angular/material/checkbox';
import { MediaService } from '../../api-calls/getMedia';
import { MediaModel } from '../../models/media-model';
import { environment } from '../../env';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    MatCardModule,
    MatCheckboxModule,
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
  selectedFile: File | null = null;
  env = environment;

  showImages = true;
  showVideos = true;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.loadNext();
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
