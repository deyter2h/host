// src/media/media.generate.preview.ts

import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { VARS } from 'src/vars.enum';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function generatePreview(
  file: Express.Multer.File,
): Promise<string> {
  const { name: baseName } = path.parse(file.filename);
  const previewFilename = `${baseName}.jpg`;
  await fs.mkdir(VARS.STATIC_STORAGE_PREVIEW, { recursive: true });
  const previewPath = path.join(VARS.STATIC_STORAGE_PREVIEW, previewFilename);

  if (file.mimetype.startsWith('image/')) {
    const inputBuffer = await fs.readFile(file.path);
    await sharp(inputBuffer)
      .resize({ width: 320 })
      .jpeg({ quality: 70 })
      .toFile(previewPath);
  } else if (file.mimetype.startsWith('video/')) {
    const { duration } = await new Promise<{ duration: number }>(
      (resolve, reject) => {
        ffmpeg.ffprobe(file.path, (err, metadata) => {
          if (err) return reject(err);
          const d = metadata.format?.duration;
          if (!d)
            return reject(new Error('Could not determine video duration'));
          resolve({ duration: d });
        });
      },
    );

    const ts = Math.min(0.5, duration * 0.1);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(file.path)
        .inputOptions(['-ss', `${ts}`])
        .outputOptions(['-frames:v 1', '-vf', 'scale=320:240', '-q:v', '10'])
        .output(previewPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  } else {
    throw new Error(`Unsupported mime type: ${file.mimetype}`);
  }

  return previewFilename;
}
