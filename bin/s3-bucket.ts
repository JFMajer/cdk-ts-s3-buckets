#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
//import { S3BucketStack } from '../lib/s3-bucket-stack';
import { PhotosStack } from '../lib/PhotosStack';
import { PhotosHandlerStack } from '../lib/PhotosHandlerStack';

const app = new cdk.App();
// new S3BucketStack(app, 'S3BucketStack', {});

const photosStack = new PhotosStack(app, 'PhotosStack', {});
new PhotosHandlerStack(app, 'PhotosHandlerStack', {
    targetBucketARN: photosStack.photosBucketARN,
});