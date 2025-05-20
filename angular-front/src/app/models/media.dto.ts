export interface MediaDto {
  _id:       string;
  name:      string;
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
