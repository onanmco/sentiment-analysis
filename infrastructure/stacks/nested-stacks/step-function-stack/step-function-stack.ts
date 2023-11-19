import {NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CfnStateMachine} from "aws-cdk-lib/aws-stepfunctions";
import {readFileSync} from "fs";
import {IRole} from "aws-cdk-lib/aws-iam";
import {IBucket} from "aws-cdk-lib/aws-s3";
import {IFunction} from "aws-cdk-lib/aws-lambda";

interface StepFunctionStackProps extends NestedStackProps {
  envName: string;
  appName: string;
  sentimentAnalysisStateMachineRole: IRole;
  queryResultsBucket: IBucket;
  etlResultsBucket: IBucket;
  getFromDbAndSaveToStorageFunction: IFunction;
}

export class StepFunctionStack extends NestedStack {

  private readonly sentimentAnalysisStateMachine: CfnStateMachine;

  constructor(scope: Construct, id: string, props: StepFunctionStackProps) {
    super(scope, id, props);

    this.sentimentAnalysisStateMachine = new CfnStateMachine(
      this,
      "step-function",
      {
        stateMachineName: `${props.envName}-${props.appName}-sentiment-analysis`,
        roleArn: props.sentimentAnalysisStateMachineRole.roleArn,
        definitionString: readFileSync("src/step-function-definition/sentiment-analysis.asl.json", "utf-8"),
        definitionSubstitutions: {
          "GetFromDbAndSaveToStorageFunctionArn": props.getFromDbAndSaveToStorageFunction.latestVersion.functionArn
        }
      }
    );

    props.queryResultsBucket.grantRead(props.sentimentAnalysisStateMachineRole);
    props.etlResultsBucket.grantWrite(props.sentimentAnalysisStateMachineRole);

  }

}