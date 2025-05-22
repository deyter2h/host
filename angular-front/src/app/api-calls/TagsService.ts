import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env';

export interface Tag {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class TagsService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.mediaUrl + 'categories');
  }
}
