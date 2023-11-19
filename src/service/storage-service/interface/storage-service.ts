import {PutObjectCommandInput} from "@aws-sdk/client-s3";

export interface IStorageService {
  putObject(input: PutObjectCommandInput): Promise<void>;
}