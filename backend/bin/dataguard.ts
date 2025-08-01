import * as cdk from "aws-cdk-lib";
import { DataGuardPipeline } from "../lib/dataguard-pipeline";

const app = new cdk.App();

const env = {
  account: "445567075183",
  region: "eu-central-1",
};

new DataGuardPipeline(app, "DataGuardPipelineStack", { env });
