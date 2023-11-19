import {Container} from "inversify";
import {Types} from "./types";
import {DataService} from "../../service/data-service/data-service";
import {StorageService} from "../../service/storage-service/storage-service";
import {CsvUtil} from "../../util/csv-util/csv-util";

const container = new Container();

container.bind(Types.DataService).to(DataService)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind(Types.StorageService).to(StorageService)
  .inSingletonScope()
  .whenTargetIsDefault();

container.bind(Types.CsvUtil).to(CsvUtil)
  .inSingletonScope()
  .whenTargetIsDefault();

export {container};
