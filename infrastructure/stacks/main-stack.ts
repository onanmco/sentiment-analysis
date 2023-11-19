import { Construct } from 'constructs';
import {S3Stack} from "./nested-stacks/s3-stack/s3-stack";
import {Stack, StackProps} from "aws-cdk-lib";
import {DynamodbStack} from "./nested-stacks/dynamodb-stack/dynamodb-stack";
import {LambdaStack} from "./nested-stacks/lambda-stack/lambda-stack";
import {IamStack} from "./nested-stacks/iam-stack/iam-stack";
import {StepFunctionStack} from "./nested-stacks/step-function-stack/step-function-stack";

export interface MainStackProps extends StackProps {
  envName: string;
  appName: string;
}

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: MainStackProps) {
    super(scope, id, props);

    const s3Stack = new S3Stack(
      this,
      "s3-stack",
      {
        envName: props.envName,
        appName: props.appName,
        description: "Creates S3 buckets for the sentiment analysis application."
      }
    );

    new DynamodbStack(
      this,
      "dynamodb-stack",
      {
        envName: props.envName,
        appName: props.appName,
        description: "Creates DynamoDB tables for the sentiment analysis application.",
        migrationDataBucket: s3Stack.getMigrationDataBucket()
      }
    );

    const lambdaStack = new LambdaStack(
      this,
      "lambda-stack",
      {
        envName: props.envName,
        appName: props.appName,
        description: "Creates Lambda functions for the sentiment analysis application.",
        queryResultsBucket: s3Stack.getQueryResultsBucket()
      }
    );

    const iamStack = new IamStack(
      this,
      "iam-stack",
      {
        envName: props.envName,
        appName: props.appName,
        description: "Creates IAM roles and policies for the sentiment analysis application."
      }
    );

    new StepFunctionStack(
      this,
      "step-function-stack",
      {
        envName: props.envName,
        appName: props.appName,
        description: "Creates the sentiment analysis state machine.",
        sentimentAnalysisStateMachineRole: iamStack.getSentimentAnalysisStateMachineRole(),
        queryResultsBucket: s3Stack.getQueryResultsBucket(),
        etlResultsBucket: s3Stack.getEtlResultsBucket(),
        getFromDbAndSaveToStorageFunction: lambdaStack.getGetFromDbAndSaveToStorage()
      }
    );

  }
}
