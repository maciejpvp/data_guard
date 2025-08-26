import * as cdk from "aws-cdk-lib";
import { createLambdas } from "../infra/createLambdas";
import { configureApiGateway } from "../infra/configureApiGateway";
import { createVaultDB } from "../infra/createVaultDB";
import { configureCognito } from "../infra/configureCognito";
import { createConnectionsDB } from "../infra/createConnectionsDB";
import { configureWebSocketApi } from "../infra/configureWebSocketApi";
import * as iam from "aws-cdk-lib/aws-iam";
import { CreateLambda } from "@/constructs/CreateLambda";

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
    const { endpoint, wsApi } = configureWebSocketApi(
      this,
      lambdas,
      props.stage,
    );

    const needWsAccess = Object.values(lambdas).filter((l) => l.grantWsAccess);

    for (const l of needWsAccess) {
      l.lambdaFunction.addEnvironment("WS_ENDPOINT", endpoint);
      l.lambdaFunction.addToRolePolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["execute-api:ManageConnections"],
          resources: [
            `arn:aws:execute-api:eu-central-1:${this.account}:${wsApi.apiId}/test/POST/@connections/*`,
          ],
        }),
      );
    }
  }
}
