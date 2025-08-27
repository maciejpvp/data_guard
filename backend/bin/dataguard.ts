import * as cdk from "aws-cdk-lib";
import { DataGuardStack } from "../lib/dataguard-stack";

const app = new cdk.App();

// Stack test
new DataGuardStack(app, "DataGuardTestStack", {
  stage: "test",
});

// Stack prod
new DataGuardStack(app, "DataGuardProdStack", {
  stage: "prod",
});

app.synth();
