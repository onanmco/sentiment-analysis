import "reflect-metadata";
import {AppendToCsvEvent, Handler} from "./types";
import {IStorageService} from "../../service/storage-service/interface/storage-service";
import {Types} from "../../config/di/types";
import {container} from "../../config/di/container";
import middy from "@middy/core";
import {deserializer} from "../../middleware/deserializer";
import {validator} from "../../middleware/validator";
import errorLogger from "@middy/error-logger";

const _handler: Handler = async (event) => {
  const storageService: IStorageService = await container.getAsync(Types.StorageService);
  await storageService.appendToCsv(event);
}

export const handler = middy()
  .use(deserializer.of(AppendToCsvEvent))
  .use(validator())
  .handler(_handler)
  .use(errorLogger());
