import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { DataGuardStage } from "./dataguard-stage";

export class DataGuardPipeline extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const env = props.env;

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "DataGuardPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("maciejpvp/data_guard", "main", {
          authentication: SecretValue.secretsManager("github-token"),
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    const testStage = pipeline.addStage(
      new DataGuardStage(this, "Test", { env }),
    );

    pipeline.addStage(new DataGuardStage(this, "Prod", { env }), {
      pre: [new ManualApprovalStep("PromoteToProd")],
    });
  }
}
