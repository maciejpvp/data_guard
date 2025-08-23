import * as cdk from "aws-cdk-lib";
import { createLambdas } from "../infra/createLambdas";
import { configureApiGateway } from "../infra/configureApiGateway";
import { createVaultDB } from "../infra/createVaultDB";
import { configureCognito } from "../infra/configureCognito";
import { createConnectionsDB } from "../infra/createConnectionsDB";
import { configureWebSocketApi } from "../infra/configureWebSocketApi";

interface DataGuardStackProps extends cdk.StackProps {
  stage: string;
}

export class DataGuardStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: DataGuardStackProps) {
    super(scope, id, props);

    const { userPool, userPoolClient } = configureCognito(this, props.stage);

    const vaultDB = createVaultDB(this, { stage: props.stage });

    const connectionsDB = createConnectionsDB(this, { stage: props.stage });

    const lambdas = createLambdas(this, {
      stage: props.stage,
      vaultDB,
      connectionsDB,
      userPool,
      userPoolClient,
    });

    configureApiGateway(this, lambdas, userPool, props.stage);
    configureWebSocketApi(this, lambdas, props.stage);
  }
}
