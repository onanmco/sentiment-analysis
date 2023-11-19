import {GetInput} from "../types";
import {JSONArray, JSONObject} from "../../../common/types";

export interface IDataService {
  get(input: GetInput): Promise<JSONObject | JSONArray>;
}