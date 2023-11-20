import {PutObjectCommandInput} from "@aws-sdk/client-s3";
import {AppendToCsvEvent} from "../../../lambda/append-to-csv/types";

export interface IStorageService {
  putObject(input: PutObjectCommandInput): Promise<void>;
  appendToCsv(input: AppendToCsvEvent): Promise<void>;
}