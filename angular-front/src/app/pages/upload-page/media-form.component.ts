// media-form.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import  { TagsService, Tag } from '../../api-calls/TagsService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MediaService } from '../../api-calls/getMedia';

@Component({
  selector: 'app-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatCardModule,        // <-- здесь и лежит MatCardActions
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
})
export class MediaFormComponent implements OnInit {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  tags: Tag[] = [];
  selectedFile?: File;
  categoriesControl = new FormControl<string[]>([], Validators.required);

  constructor(
    private fb: FormBuilder,
    private tagsService: TagsService,
    private mediaService: MediaService,
    private dialogRef: MatDialogRef<MediaFormComponent>
  ) {}

  ngOnInit() {
    // Инициализация формы
    this.form = this.fb.group({
      authorName: ['', Validators.required],
      name:       ['', Validators.required],
      categories: [<string[]>[], Validators.required],
      file:       [null, Validators.required]
    });

    // Загрузка доступных тегов
    this.tagsService.getTags().subscribe({
      next: tags => this.tags = tags,
      error: err => console.error('Не удалось загрузить теги', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ file: this.selectedFile });
    }
  }

  submit() {
    if (this.form.invalid || !this.selectedFile) {
      return;
    }

    const fd = new FormData();
    fd.append('authorName', this.form.value.authorName);
    fd.append('name', this.form.value.name);
    fd.append('categories', JSON.stringify(this.form.value.categories));
    fd.append('file', this.selectedFile);

    this.mediaService.uploadMedia(fd).subscribe({
      next: (createdMedia) => {
        // Закрываем диалог, отдаём созданный файл
        this.dialogRef.close(createdMedia);
      },
      error: err => {
        console.error('Ошибка при загрузке', err);
      }
    });
  }
}
