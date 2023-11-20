import {Duration, NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {IBucket} from "aws-cdk-lib/aws-s3";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Architecture, IFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends NestedStackProps {
  envName: string;
  appName: string;
  queryResultsBucket: IBucket;
  etlResultsBucket: IBucket;
}

export class LambdaStack extends NestedStack {

  private readonly getFromDbAndSaveToStorage: IFunction;
  private readonly appendToCsv: IFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.getFromDbAndSaveToStorage = new NodejsFunction(
      this,
      "get-from-db-and-save-to-storage-function",
      {
        functionName: `${props.envName}-${props.appName}-get-from-db-and-save-to-storage`,
        architecture: Architecture.X86_64,
        timeout: Duration.minutes(1),
        runtime: Runtime.NODEJS_18_X,
        entry: "src/lambda/get-from-db-and-save-to-storage/index.ts",
        handler: "handler",
        bundling: {
          minify: true,
          sourceMap: true
        }
      }
    );

    props.queryResultsBucket.grantWrite(this.getFromDbAndSaveToStorage);

    this.getFromDbAndSaveToStorage.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBReadOnlyAccess")
    );

    this.appendToCsv = new NodejsFunction(
      this,
      "append-to-csv-function",
      {
        functionName: `${props.envName}-${props.appName}-append-to-csv`,
        architecture: Architecture.X86_64,
        timeout: Duration.minutes(1),
        runtime: Runtime.NODEJS_18_X,
        entry: "src/lambda/append-to-csv/index.ts",
        handler: "handler",
        bundling: {
          minify: true,
          sourceMap: true
        }
      }
    );

    props.etlResultsBucket.grantReadWrite(this.appendToCsv);

  }

  public getGetFromDbAndSaveToStorage(): IFunction {
    return this.getFromDbAndSaveToStorage;
  }

  public getAppendToCsv(): IFunction {
    return this.appendToCsv;
  }

}