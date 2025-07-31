import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

new PipelineStack(app, "PipelineStack", {
  env: {
    account: "445567075183",
    region: "eu-central-1",
  },
});

app.synth();
