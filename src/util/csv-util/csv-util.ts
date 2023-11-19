import {ICsvUtil} from "./interface/csv-util";
import {injectable} from "inversify";
import {JSONArray, JSONObject} from "../../common/types";
import Papa, {UnparseConfig} from "papaparse";

@injectable()
export class CsvUtil implements ICsvUtil {
  public convertJsonToCsv(json: JSONObject | JSONArray): string {
    const options: UnparseConfig = {
      quoteChar: '"',
      delimiter: ",",
      header: true,
      newline: "\n"
    }

    if (Array.isArray(json)) {
      return Papa.unparse(json, options);
    }

    return Papa.unparse([json], options);
  }

}