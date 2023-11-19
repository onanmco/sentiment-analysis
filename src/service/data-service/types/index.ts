import {GetCommandInput, QueryCommandInput, ScanCommandInput} from "@aws-sdk/lib-dynamodb";

export interface GetInput {
  commandType: string;
  command: GetCommandInput | QueryCommandInput | ScanCommandInput;
}