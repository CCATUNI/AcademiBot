import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { S3 } from 'aws-sdk';
import { S3ConfigService } from './config/s3-config.service';


@Injectable()
export class FilesystemService {
  private readonly bucket: string;
  private readonly s3: S3;
  constructor(private s3ConfigService: S3ConfigService) {
    const configuration = this.s3ConfigService.getConfiguration();
    this.s3 = new S3(configuration);
    this.bucket = configuration.bucket;
  }

  async listObjectsUnder(
    prefix: string,
    continuationToken?: string,
    previousResult: S3.ObjectList = [],
  ): Promise<S3.ObjectList> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.bucket,
      EncodingType: 'url',
      Prefix: prefix,
      ContinuationToken: continuationToken || undefined,
    };
    const response = await this.s3.listObjectsV2(params).promise();
    const result: S3.ObjectList = [
      ...previousResult,
      ...response.Contents,
    ].filter(value => value.Size > 0);
    if (response.IsTruncated) {
      return await this.listObjectsUnder(
        prefix,
        response.NextContinuationToken,
        result,
      );
    }
    return result;
  }

  async listObjectsDirectlyUnder(
    prefix: string,
    continuationToken?: string,
    previousResult: S3.ObjectList = [],
  ): Promise<S3.ObjectList> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.bucket,
      EncodingType: 'url',
      Prefix: prefix,
      ContinuationToken: continuationToken || undefined,
      Delimiter: '/',
    };
    const response = await this.s3.listObjectsV2(params).promise();
    const result: S3.ObjectList = [
      ...previousResult,
      ...response.Contents,
    ].filter(value => value.Size > 0);
    if (response.IsTruncated) {
      return await this.listObjectsDirectlyUnder(
        prefix,
        response.NextContinuationToken,
        result,
      );
    }
    return result;
  }

  async getObject(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };
    const object: S3.GetObjectOutput = await this.s3
      .getObject(params)
      .promise();
    object.ETag = object.ETag.replace(/"/g, '');
    return object;
  }

  async createObject(
    key: string,
    parameters: {
      Body?: Buffer | Uint8Array | Blob | string | Readable;
      ContentLength?: number;
      ContentType?: string;
      Metadata?: { [key: string]: string };
    },
  ) {
    const params = {
      Body: parameters.Body,
      Bucket: this.bucket,
      Key: key,
      ContentType: parameters.ContentType
    };
    const object: S3.PutObjectOutput = await this.s3
      .putObject(params)
      .promise();
    object.ETag = object.ETag.replace(/"/g, '');
    return object;
  }

  async deleteObject(key: string) {
    const params = {
      Key: key,
      Bucket: this.bucket,
    };
    const response: S3.DeleteObjectOutput = await this.s3
      .deleteObject(params)
      .promise();
    return response;
  }

  async copyObject(key: string, to: string) {
    const params = {
      CopySource: `/${this.bucket}/${key}`,
      Bucket: this.bucket,
      Key: to,
    };
    const response: S3.CopyObjectOutput = await this.s3
      .copyObject(params)
      .promise();
    return response;
  }

  async moveObject(key: string, to: string) {
    const newObject = await this.copyObject(key, to);
    await this.deleteObject(key);
    newObject.CopyObjectResult.ETag = newObject.CopyObjectResult.ETag.replace(/"/g, '');
    return newObject;
  }

  async renameObject(key: string, newName: string, justName: boolean = true) {
    let newKey: string;
    if (justName) {
      const lista = key.split('/');
      const fileName = lista[lista.length - 1];
      lista.pop();
      const extension = fileName.substr(fileName.lastIndexOf('.'));
      if (lista.length > 0) {
        newKey = `${lista.join('/')}/${newName}${extension}`;
      } else {
        newKey = `${newName}${extension}`;
      }
    } else {
      newKey = newName;
    }
    return this.moveObject(key, newKey);
  }

  async getPublicUrl(key: string, time: number = 600) {
    const params = {
      Key: key,
      Bucket: this.bucket,
      Expires: time,
    };
    return this.s3.getSignedUrl('getObject', params);
  }

  createReadableStream(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };
    return this.s3.getObject(params).createReadStream();
  }




}
