import {NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Effect, IRole, ManagedPolicy, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

interface IamStackProps extends NestedStackProps {
  envName: string;
  appName: string;
}

export class IamStack extends NestedStack {

  private readonly sentimentAnalysisStateMachineRole: IRole;

  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    this.sentimentAnalysisStateMachineRole = new Role(
      this,
      "sentiment-analysis-state-machine-role",
      {
        roleName: `${props.envName}-${props.appName}-sentiment-analysis-sf-role`,
        assumedBy: new ServicePrincipal("states.amazonaws.com"),
        description: "Role for the sentiment analysis state machine",
      }
    );

    const lambdaInvokePolicy = new ManagedPolicy(
      this,
      "lambda-invoke-policy",
      {
        managedPolicyName: `${props.envName}-${props.appName}-lambda-invoke-policy`,
        description: "Policy to allow lambda invoke",
        statements: [
          new PolicyStatement(
            {
              effect: Effect.ALLOW,
              actions: [
                "lambda:InvokeFunction"
              ],
              resources: [
                `arn:${this.partition}:lambda:${this.region}:${this.account}:function:${props.envName}-${props.appName}*`
              ]
            }
          )
        ]
      }
    );

    const sfStartExecutionManagementScopedAccessPolicy = new ManagedPolicy(
      this,
      "sf-start-execution-management-scoped-access-policy",
      {
        managedPolicyName: `${props.envName}-${props.appName}-sf-start-execution-management-scoped-access-policy`,
        description: "Policy to allow start execution of state machine",
        statements: [
          new PolicyStatement(
            {
              effect: Effect.ALLOW,
              actions: [
                "states:StartExecution"
              ],
              resources: [
                `arn:${this.partition}:states:${this.region}:${this.account}:stateMachine:${props.envName}-${props.appName}*`
              ]
            }
          ),
          new PolicyStatement(
            {
              effect: Effect.ALLOW,
              actions: [
                "states:DescribeExecution",
                "states:StopExecution"
              ],
              resources: [
                `arn:${this.partition}:states:${this.region}:${this.account}:execution:${props.envName}-${props.appName}*`
              ]
            }
          ),
          new PolicyStatement(
            {
              effect: Effect.ALLOW,
              actions: [
                "events:PutTargets",
                "events:PutRule",
                "events:DescribeRule"
              ],
              resources: [
                `arn:${this.partition}:events:${this.region}:${this.account}:rule/StepFunctionsGetEventsForStepFunctionsExecutionRule`
              ]
            }
          )
        ]
      }
    );

    const xRayAccessPolicy = new ManagedPolicy(
      this,
      "x-ray-access-policy",
      {
        managedPolicyName: `${props.envName}-${props.appName}-x-ray-access-policy`,
        description: "Policy to allow x-ray access",
        statements: [
          new PolicyStatement(
            {
              effect: Effect.ALLOW,
              actions: [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords",
                "xray:GetSamplingRules",
                "xray:GetSamplingTargets"
              ],
              resources: [
                "*"
              ]
            }
          )
        ]
      }
    );

    this.sentimentAnalysisStateMachineRole.addManagedPolicy(lambdaInvokePolicy);
    this.sentimentAnalysisStateMachineRole.addManagedPolicy(sfStartExecutionManagementScopedAccessPolicy);
    this.sentimentAnalysisStateMachineRole.addManagedPolicy(xRayAccessPolicy);
    this.sentimentAnalysisStateMachineRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("ComprehendReadOnly"));
  }

  public getSentimentAnalysisStateMachineRole(): IRole {
    return this.sentimentAnalysisStateMachineRole;
  }

}