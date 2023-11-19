import {NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CfnTable} from "aws-cdk-lib/aws-dynamodb";
import {IBucket} from "aws-cdk-lib/aws-s3";

interface DynamodbStackProps extends NestedStackProps {
  envName: string;
  appName: string;
  migrationDataBucket: IBucket;
}

export class DynamodbStack extends NestedStack {

  private readonly reviewsTable: CfnTable;

  constructor(scope: Construct, id: string, props: DynamodbStackProps) {
    super(scope, id, props);

    this.reviewsTable = new CfnTable(
      this,
      "reviews-table",
      {
        tableName: `${props.envName}-${props.appName}-reviews`,
        keySchema: [
          {
            attributeName: "id",
            keyType: "HASH"
          }
        ],
        attributeDefinitions: [
          {
            attributeName: "id",
            attributeType: "N"
          }
        ],
        billingMode: "PAY_PER_REQUEST",
        importSourceSpecification: {
          inputFormat: "CSV",
          s3BucketSource: {
            s3Bucket: props.migrationDataBucket.bucketName,
            s3KeyPrefix: "tables/reviews/FULL_LOAD_001.csv"
          }
        }
      }
    )

  }

}