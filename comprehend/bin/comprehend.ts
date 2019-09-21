#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { ComprehendStack } from '../lib/comprehend-stack';

const app = new cdk.App();
new ComprehendStack(app, 'ComprehendStack');