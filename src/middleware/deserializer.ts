import middy from "@middy/core";
import {ClassConstructor, plainToInstance} from "class-transformer";

export const deserializer = {
  of: function (target: Function): middy.MiddlewareObj {
    const before: middy.MiddlewareFn = async (request) => {
      request.event = plainToInstance(target as ClassConstructor<typeof target>, request.event);
    }

    return {
      before
    };
  }
}