import middy from "@middy/core";
import {validateOrReject} from "class-validator";

export const validator = (): middy.MiddlewareObj => {
  const before: middy.MiddlewareFn = async (request) => {
    await validateOrReject(request.event);
  }

  return {
    before
  };
}