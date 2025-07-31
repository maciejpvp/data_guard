import * as cdk from "aws-cdk-lib";
import { DataGuardStack } from "../lib/dataguard-stack";

const app = new cdk.App();

new DataGuardStack(app, "dataguard-stack");

app.synth();
