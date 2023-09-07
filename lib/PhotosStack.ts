import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

const appName: string = "photos";
export class PhotosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creates s3 bucket using l2 construct
    const myL2Bucket = new Bucket(this, "PhotosBucket", {
      versioned: false,
      bucketName: `my-l2-bucket-${appName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(5),
        },
      ],
    });

    console.log(`My L2 Bucket Name: ${myL2Bucket.bucketName}`);

    new cdk.CfnOutput(this, "MyL2BucketName", {
      value: myL2Bucket.bucketName,
    });
  }
}


