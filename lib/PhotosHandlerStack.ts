import * as cdk from "aws-cdk-lib";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { Fn } from "aws-cdk-lib";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";

interface PhotosHandlerStackProps extends cdk.StackProps {
  targetBucketARN: string;
}


const appName: string = "photos";
export class PhotosHandlerStack extends cdk.Stack {
  private stackSuffix: string;


  constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
    super(scope, id, props);
    this.generateStackSuffix();

    // const targetBucket = Fn.importValue('photos-bucket');
    
    const PhotosHandlerFunction = new LambdaFunction(this, 'PhotosHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      functionName: `photos-handler-${appName}-${this.stackSuffix}`,
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("hello from lambda! linked bucket arn is: " + process.env.TARGET_BUCKET);
        }
      `),
      environment: {
        TARGET_BUCKET: props.targetBucketARN,
      }
    });
    
    
  }

  private generateStackSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    this.stackSuffix = Fn.select(4, Fn.split("-", shortStackId));
  }
}
