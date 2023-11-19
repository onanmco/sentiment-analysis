import {S3Client} from "@aws-sdk/client-s3";

if (!process.env.AWS_REGION) {
  throw new Error("Environment variable AWS_REGION must be set.");
}

export const s3Client = new S3Client(
  {
    region: process.env.AWS_REGION
  }
);