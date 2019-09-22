#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { ComprehendStack } from '../lib/comprehend-stack';

const app = new cdk.App();
new ComprehendStack(app, 'ComprehendStack');