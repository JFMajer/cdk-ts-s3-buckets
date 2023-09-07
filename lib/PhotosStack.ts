import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fromIni } from "@aws-sdk/credential-providers";
import { Fn } from "aws-cdk-lib";

const REGION = "eu-north-1";

const client = new STSClient({
  region: REGION,
  credentials: fromIni({ profile: "dev" }),
});
const command = new GetCallerIdentityCommand({});
const response = fetchData()
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
console.log(response);

const appName: string = "photos";
export class PhotosStack extends cdk.Stack {
  private stackSuffix: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.generateStackSuffix();
    // creates s3 bucket using l2 construct
    const myL2Bucket = new Bucket(this, "PhotosBucket", {
      versioned: false,
      bucketName: `my-l2-bucket-${appName}-${this.stackSuffix}`,
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

  private generateStackSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    this.stackSuffix = Fn.select(4, Fn.split("-", shortStackId));
  }
}

async function fetchData() {
  const response = await client.send(command);
  return response;
}
