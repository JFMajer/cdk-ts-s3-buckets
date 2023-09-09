import { IAspect } from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { CfnFunction } from "aws-cdk-lib/aws-lambda";

export class Tagger implements IAspect {
  private key: string;
  private value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  visit(node: IConstruct): void {
    console.log("visiting: " + node.node.id);
    if (node instanceof CfnBucket) {
        node.tags.setTag(this.key, this.value);
        node.tags.setTag("ResourceType", "S3Bucket");
    }
    if (node instanceof CfnFunction) {
        node.tags.setTag(this.key, this.value);
        node.tags.setTag("ResourceType", "Lambda");
    }
  }
}
