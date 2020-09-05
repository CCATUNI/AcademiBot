import { Injectable } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import * as crypto from 'crypto';
import * as rp from 'request-promise';
import { Response } from 'request';
import * as FileType from 'file-type';
import * as fs from 'fs';


@Injectable()
export class FileLoaderService {
  constructor(
    private filesystemService: FilesystemService
  ) {}

  // NOTE: Watch out for unwanted calls as it may upload duplicated files
  // Possible solution, upload to database to check if the sha exists before
  // uploading to filesystem
  async loadOne(buffer: Buffer, prefix: string) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    const contentSha256 = hash.digest('hex');
    const fileType = await FileType.fromBuffer(buffer);
    const contentType = fileType ? fileType.mime : null;
    const extension = fileType ? fileType.ext : null;
    const key = prefix + contentSha256;
    const sizeInBytes = buffer.length;
    await this.filesystemService.createObject(key, {
      Body: buffer,
      ContentType: contentType,
      ContentLength: sizeInBytes
    });
    return {
      contentSha256,
      sizeInBytes,
      filesystemKey: key,
      extension,
      contentType
    }
  }



  async loadFromUrl(url: string, keyPrefix: string = '') {
    const res: Response = await rp.get(url, { encoding: null, resolveWithFullResponse: true });
    if (res && res.headers && res.body) {
      const body = res.body as Buffer;
      return this.loadOne(body, keyPrefix);
    } else {
      throw new Error('Invalid response from url: ' + url);
    }
  }

  async loadFromFile(path: string, keyPrefix: string = '') {
    const file = await fs.promises.readFile(path);
    return this.loadOne(file, keyPrefix);
  }

  async loadManyFromUrl(url: string, keyPrefix: string) {

  }

}