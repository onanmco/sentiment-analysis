import {IStorageService} from "./interface/storage-service";
import {GetObjectCommand, NoSuchKey, PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";
import {s3Client} from "../../lib/s3";
import {injectable} from "inversify";
import {JSONArray, JSONObject} from "../../common/types";
import Papa, {ParseConfig, UnparseConfig} from "papaparse";
import {AppendToCsvEvent} from "../../lambda/append-to-csv/types";
import _ from "lodash";

@injectable()
export class StorageService implements IStorageService {
  public async putObject(input: PutObjectCommandInput): Promise<void> {
    await s3Client.send(new PutObjectCommand(input));
  }

  public async appendToCsv(input: AppendToCsvEvent): Promise<void> {

    let serializedBody: string | undefined;

    try {
      const result = await s3Client.send(
        new GetObjectCommand(
          {
            Bucket: input.targetS3Bucket,
            Key: input.targetS3Key
          }
        )
      );
      if (result.Body) {
        serializedBody = await result.Body.transformToString();
      }
    } catch (err) {
      console.log(err);

      if (err instanceof NoSuchKey) {
        await s3Client.send(
          new PutObjectCommand(
            {
              Bucket: input.targetS3Bucket,
              Key: input.targetS3Key
            }
          )
        );

        serializedBody = undefined;
      }
    }

    const deSerializationOptions: ParseConfig = {
      quoteChar: '"',
      delimiter: ",",
      header: true,
      newline: "\n",
    };

    let deserializedBody: JSONArray | JSONObject;

    if (!serializedBody || _.isEmpty(serializedBody)) {
      deserializedBody = [];
    } else {
      const deserializationResult = Papa.parse(serializedBody, deSerializationOptions);

      if (deserializationResult.errors.length > 0) {
        throw deserializationResult.errors[0];
      }

      deserializedBody = deserializationResult.data;
    }

    deserializedBody.push(input.itemWillBeAdded);

    const serializationOptions: UnparseConfig = {
      quoteChar: '"',
      delimiter: ",",
      header: true,
      newline: "\n",
    };

    const payload = Papa.unparse(deserializedBody, serializationOptions);

    await s3Client.send(
      new PutObjectCommand(
        {
          Bucket: input.targetS3Bucket,
          Key: input.targetS3Key,
          Body: payload
        }
      ));
  }

}