#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3BucketStack } from '../lib/s3-bucket-stack';
import { PhotosStack } from '../lib/PhotosStack';

const app = new cdk.App();
// new S3BucketStack(app, 'S3BucketStack', {});

new PhotosStack(app, 'PhotosStack', {});