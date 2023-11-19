import "reflect-metadata";
import middy from "@middy/core";
import {deserializer} from "../../middleware/deserializer";
import {validator} from "../../middleware/validator";
import errorLogger from "@middy/error-logger";
import {GetFromDbAndSaveToStorageEvent, Handler} from "./types";
import {IDataService} from "../../service/data-service/interface/data-service";
import {container} from "../../config/di/container";
import {Types} from "../../config/di/types";
import {IStorageService} from "../../service/storage-service/interface/storage-service";
import {ICsvUtil} from "../../util/csv-util/interface/csv-util";

const _handler: Handler = async (event) => {

  const dataService: IDataService = await container.getAsync(Types.DataService);

  const output = await dataService.get(
    {
      commandType: event.commandType,
      command: event.command
    }
  );

  const storageService: IStorageService = await container.getAsync(Types.StorageService);
  const csvUtil: ICsvUtil = await container.getAsync(Types.CsvUtil);

  await storageService.putObject(
    {
      Bucket: event.targetS3Bucket,
      Key: event.targetS3Key,
      Body: csvUtil.convertJsonToCsv(output)
    }
  );

}

export const handler = middy()
  .use(deserializer.of(GetFromDbAndSaveToStorageEvent))
  .use(validator())
  .handler(_handler)
  .use(errorLogger());