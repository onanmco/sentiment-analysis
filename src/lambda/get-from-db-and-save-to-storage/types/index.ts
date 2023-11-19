import {GetCommandInput, QueryCommandInput, ScanCommandInput} from "@aws-sdk/lib-dynamodb";
import {IsDefined, IsIn, IsString} from "class-validator";

export class GetFromDbAndSaveToStorageEvent {

  @IsIn(["QueryCommand", "ScanCommand", "GetCommand"])
  @IsDefined()
  commandType: string;

  @IsDefined()
  command: GetCommandInput | QueryCommandInput | ScanCommandInput;

  @IsString()
  @IsDefined()
  targetS3Bucket: string;

  @IsString()
  @IsDefined()
  targetS3Key: string;
}

export type Handler = (event: GetFromDbAndSaveToStorageEvent) => Promise<void>;