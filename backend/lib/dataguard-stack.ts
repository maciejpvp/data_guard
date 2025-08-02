import * as cdk from "aws-cdk-lib";
import { createLambdas } from "../infra/createLambdas";
import { configureApiGateway } from "../infra/configureApiGateway";
import { createVaultDB } from "../infra/createVaultDB";
import { configureCognito } from "../infra/configureCognito";

interface DataGuardStackProps extends cdk.StackProps {
  stage: string;
}

export class DataGuardStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: DataGuardStackProps) {
    super(scope, id, props);

    const { userPool } = configureCognito(this, props.stage);

    const valutDB = createVaultDB(this, { stage: props.stage });

    const lambdas = createLambdas(this, { valutDB, stage: props.stage });

    configureApiGateway(this, lambdas, userPool, props.stage);
  }
}
