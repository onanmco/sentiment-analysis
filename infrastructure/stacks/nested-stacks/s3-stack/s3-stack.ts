import {NestedStack, NestedStackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Bucket, BucketEncryption, IBucket} from "aws-cdk-lib/aws-s3";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";

interface S3StackProps extends NestedStackProps {
  envName: string;
  appName: string;
}

export class S3Stack extends NestedStack {

  private readonly migrationDataBucket: IBucket;
  private readonly queryResultsBucket: IBucket;
  private readonly etlResultsBucket: IBucket;

  constructor(scope: Construct, id: string, props: S3StackProps) {
    super(scope, id, props);

    this.migrationDataBucket = new Bucket(
      this,
      "migration-data-bucket",
      {
        bucketName: `${props.envName}-${props.appName}-migration-data`,
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true
        },
        enforceSSL: true,
        encryption: BucketEncryption.S3_MANAGED
      }
    );

    new BucketDeployment(
      this,
      "migration-data-bucket-deployment",
      {
        sources: [
          Source.asset("resources/migration-data/tables/reviews/")
        ],
        destinationKeyPrefix: "tables/reviews/",
        destinationBucket: this.migrationDataBucket
      }
    );

    this.queryResultsBucket = new Bucket(
      this,
      "query-results-bucket",
      {
        bucketName: `${props.envName}-${props.appName}-query-results`,
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true
        },
        enforceSSL: true,
        encryption: BucketEncryption.S3_MANAGED
      }
    );

    this.etlResultsBucket = new Bucket(
      this,
      "etl-results-bucket",
      {
        bucketName: `${props.envName}-${props.appName}-etl-results`,
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true
        },
        enforceSSL: true,
        encryption: BucketEncryption.S3_MANAGED
      }
    );
  }

  public getMigrationDataBucket(): IBucket {
    return this.migrationDataBucket;
  }

  public getQueryResultsBucket(): IBucket {
    return this.queryResultsBucket;
  }

  public getEtlResultsBucket(): IBucket {
    return this.etlResultsBucket;
  }

}