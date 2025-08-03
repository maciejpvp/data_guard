import * as cdk from "aws-cdk-lib";
import { DataGuardStack } from "../lib/dataguard-stack";

const app = new cdk.App();

const stage = app.node.tryGetContext("stage") || process.env.STAGE || "dev";

new DataGuardStack(app, "dataguard-stack", { stage });

app.synth();
