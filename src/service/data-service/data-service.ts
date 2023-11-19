import {IDataService} from "./interface/data-service";
import {GetInput} from "./types";
import {JSONArray, JSONObject} from "../../common/types";
import {documentClient} from "../../lib/dynamodb";
import {GetCommand, GetCommandInput, QueryCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";
import {injectable} from "inversify";
import {EmptyResultSetError} from "../../error/EmptyResultSetError";

@injectable()
export class DataService implements IDataService {
  public async get(input: GetInput): Promise<JSONObject | JSONArray> {
    let result: JSONObject | JSONArray | undefined;

    if (input.commandType === "QueryCommand") {
      const queryResult = await documentClient.send(new QueryCommand(input.command));
      result = queryResult.Items;
    }

    if (input.commandType === "ScanCommand") {
      const queryResult = await documentClient.send(new ScanCommand(input.command));
      result = queryResult.Items;
    }

    if (input.commandType === "GetCommand") {
      const queryResult = await documentClient.send(new GetCommand(input.command as GetCommandInput));
      result = queryResult.Item;
    }

    if (!result) {
      throw new EmptyResultSetError();
    }

    return result;
  }

}