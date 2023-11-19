import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

if (!process.env.AWS_REGION) {
  throw new Error("Environment variable AWS_REGION must be set.");
}

const dynamoDbClient = new DynamoDBClient(
  {
    region: process.env.AWS_REGION
  }
);

export const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);