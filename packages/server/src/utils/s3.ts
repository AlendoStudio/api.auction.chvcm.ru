import * as path from "path";

import * as AWS from "aws-sdk";

import {Env} from "../env";

/**
 * AWS S3
 */
export class S3 {
  /**
   * Client
   */
  public static readonly client: AWS.S3 = new AWS.S3({
    accessKeyId: Env.AWS_ACCESS_KEY_ID,
    endpoint: Env.AWS_S3_ENDPOINT,
    secretAccessKey: Env.AWS_SECRET_ACCESS_KEY,
  });

  /**
   * Create bucket
   * @throws Error
   */
  public static async createBucket(): Promise<void> {
    if (!(await S3.isBucketExists())) {
      await S3.client
        .createBucket({
          Bucket: Env.AWS_S3_BUCKET,
        })
        .promise();
    }
  }

  /**
   * Delete bucket
   * @throws Error
   */
  public static async deleteBucket(): Promise<void> {
    if (await S3.isBucketExists()) {
      await S3.emptyBucketOnly();
      await S3.client
        .deleteBucket({
          Bucket: Env.AWS_S3_BUCKET,
        })
        .promise();
    }
  }

  /**
   * Generate entity attachments key
   * @param entityId Entity ID
   */
  public static entityAttachments(entityId: string): string {
    return path.posix.join(
      Env.AWS_S3_PREFIX,
      "entities",
      entityId,
      "attachments",
      path.posix.sep,
    );
  }

  /**
   * Generate entity attachment key
   * @param entityId Entity ID
   * @param attachmentName Attachment name
   */
  public static entityAttachment(
    entityId: string,
    attachmentName: string,
  ): string {
    return path.posix.join(S3.entityAttachments(entityId), attachmentName);
  }

  private static async isBucketExists(): Promise<boolean> {
    try {
      await S3.client
        .headBucket({
          Bucket: Env.AWS_S3_BUCKET,
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  private static async emptyBucketOnly(): Promise<void> {
    let objects = await S3.client
      .listObjects({
        Bucket: Env.AWS_S3_BUCKET,
      })
      .promise();

    while (true) {
      const keysForDeletion = (objects.Contents || []).map((c) => ({
        Key: c.Key as string,
      }));
      if (keysForDeletion.length) {
        await S3.client
          .deleteObjects({
            Bucket: Env.AWS_S3_BUCKET,
            Delete: {
              Objects: keysForDeletion,
            },
          })
          .promise();
      }

      if (objects.IsTruncated) {
        objects = await S3.client
          .listObjects({
            Bucket: Env.AWS_S3_BUCKET,
            Marker: objects.NextMarker,
          })
          .promise();
      } else {
        break;
      }
    }
  }
}
