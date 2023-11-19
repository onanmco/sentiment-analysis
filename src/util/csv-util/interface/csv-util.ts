import {JSONArray, JSONObject} from "../../../common/types";

export interface ICsvUtil {
  convertJsonToCsv(json: JSONObject | JSONArray): string;
}