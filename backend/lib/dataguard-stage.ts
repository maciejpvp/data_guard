import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DataGuardStack } from "./dataguard-stack";

export class DataGuardStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new DataGuardStack(this, "DataGuardStack", props);
  }
}
