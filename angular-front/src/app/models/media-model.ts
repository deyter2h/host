export interface MediaModel {
  _id:       string;
  name:      string;
  source: string;
  previewSource: string;
  type:      'image' | 'video';
  categories: {
    _id: string,
    name: string,
  }[];
  authorName:string;
  createdAt: string;
  previewUrl:string;
  url:       string;
  mimeType: string;
  sizeBytes: number;
  description?: string;
}