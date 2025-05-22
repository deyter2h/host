// src/app/services/media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaModel } from '../models/media-model';
import { environment } from '../env';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private readonly http: HttpClient) {}

  getMedia(
    page: number,
    limit: number
  ): Observable<{ data: MediaModel[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{ data: MediaModel[]; total: number }>(environment.mediaUrl, {
      params,
    });
  }

  uploadMedia(
    fd: FormData
  ): Observable<MediaModel> {
    return this.http.post<MediaModel>(environment.mediaUrl, fd);
  }
}
