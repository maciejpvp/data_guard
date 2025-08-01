import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

type CommonProps = {
  api: apigateway.RestApi;
  type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  route: string | string[];
  lambda: lambda.IFunction;
  name?: string;
};

export type ApiRouteProps =
  | (CommonProps & {
      secured: true;
      authorizer: apigateway.CognitoUserPoolsAuthorizer;
    })
  | (CommonProps & {
      secured?: false;
      authorizer?: never;
    });

export class ApiRoute extends Construct {
  constructor(scope: Construct, id: string, props: ApiRouteProps) {
    super(scope, id);

    const {
      api,
      authorizer,
      type,
      route,
      lambda,
      secured = false,
      name,
    } = props;

    const parts = Array.isArray(route)
      ? route.filter(Boolean)
      : route.split("/").filter(Boolean);

    if (parts.length === 0) {
      throw new Error("Route path must not be empty");
    }

    let resource = api.root;
    for (const part of parts) {
      resource = resource.addResource(part);
      // addCorsMock(resource);
    }

    resource.addMethod(type, new apigateway.LambdaIntegration(lambda), {
      ...(secured && {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }),
      operationName: name ?? `${type} ${parts.join("/")}`,
    });
  }
}
