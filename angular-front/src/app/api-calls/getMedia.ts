// src/app/services/media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaModel } from '../models/media-model';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly API = 'http://localhost:3000/api/media';

  constructor(private readonly http: HttpClient) {}

  getMedia(
    page: number,
    limit: number
  ): Observable<{ data: MediaModel[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{ data: MediaModel[]; total: number }>(this.API, {
      params,
    });
  }

  uploadMedia(
    file: File,
    name: string,
    authorName: string,
    categories: string[]
  ): Observable<MediaModel> {
    const form = new FormData();
    form.append('file', file);
    form.append('authorName', authorName);
    form.append('name', name);
    // if your backend expects categories[] fields:
    categories.forEach(cat => form.append('categories', cat));
    // if it expects a JSON array instead, do:
    // form.append('categories', JSON.stringify(categories));

    return this.http.post<MediaModel>(this.API, form);
  }
}
