import * as cdk from "aws-cdk-lib";
import { createLambdas } from "../infra/createLambdas";
import { configureApiGateway } from "../infra/configureApiGateway";
import { createVaultDB } from "../infra/createVaultDB";
import { configureCognito } from "../infra/configureCognito";
import { Construct } from "constructs";

export class DataGuardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { userPool } = configureCognito(this);

    const valutDB = createVaultDB(this);

    const lambdas = createLambdas(this, { valutDB });

    configureApiGateway(this, lambdas, userPool);
  }
}
