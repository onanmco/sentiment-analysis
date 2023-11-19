import {IStorageService} from "./interface/storage-service";
import {PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";
import {s3Client} from "../../lib/s3";
import {injectable} from "inversify";

@injectable()
export class StorageService implements IStorageService {
  public async putObject(input: PutObjectCommandInput): Promise<void> {
    await s3Client.send(new PutObjectCommand(input));
  }

}