#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyFirstCfStack } from '../lib/my-first-cf-stack';

const app = new cdk.App();
new MyFirstCfStack(app, 'MyFirstCfStack');
