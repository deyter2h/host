// src/app/services/media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaDto } from '../models/media.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}

  getMedia(page = 1, limit = 12): Observable<{ data: MediaDto[]; total: number }> {
    return this.http.get<{ data: MediaDto[]; total: number }>(
      `http://localhost:3000/api/media?page=${page}&limit=${limit}`
    );
  }
}
