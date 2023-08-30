import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expirationInDays?: number) {
    super(scope, id);

    new Bucket(this, "MyL3Bucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(expirationInDays || 2),
        },
      ],
    });
  }
}

export class S3BucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const randomNum = generateRandomNumber(10000000, 99999999);

    // creates s3 bucket using l2 construct
    const myL2Bucket = new Bucket(this, "MyL2Bucket", {
      versioned: true,
      bucketName: `my-l2-bucket-${randomNum}`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(2),
        },
      ],
    });

    console.log(`My L2 Bucket Name: ${myL2Bucket.bucketName}`);

    new cdk.CfnOutput(this, "MyL2BucketName", {
      value: myL2Bucket.bucketName,
    });

    // creates s3 bucket using l1 construct
    new CfnBucket(this, "MyL1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 2,
            status: "Enabled",
          },
        ],
      },
    });

    // creates s3 bucket using l3 construct
    new L3Bucket(this, "MyL3Bucket", 3);

  }
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
