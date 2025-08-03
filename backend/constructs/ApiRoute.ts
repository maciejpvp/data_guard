import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

type CommonProps = {
  api: apigateway.RestApi;
  type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  route: string | string[];
  lambda: lambda.IFunction;
  name?: string;
  requestSchema?: {
    modelName: string;
    schema: apigateway.JsonSchema;
    validateRequestBody?: boolean;
    validateRequestParameters?: boolean;
  };
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
      requestSchema,
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
    }

    // Create model and request validator if schema provided
    let requestModel: apigateway.Model | undefined;
    let validator: apigateway.RequestValidator | undefined;

    if (requestSchema) {
      requestModel = new apigateway.Model(
        this,
        `${requestSchema.modelName}Model`,
        {
          restApi: api,
          contentType: "application/json",
          modelName: requestSchema.modelName,
          schema: requestSchema.schema,
        },
      );

      validator = new apigateway.RequestValidator(
        this,
        `${requestSchema.modelName}Validator`,
        {
          restApi: api,
          requestValidatorName: `${requestSchema.modelName}-validator`,
          validateRequestBody: requestSchema.validateRequestBody ?? true,
          validateRequestParameters:
            requestSchema.validateRequestParameters ?? false,
        },
      );
    }

    resource.addMethod(type, new apigateway.LambdaIntegration(lambda), {
      ...(secured && {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }),
      operationName: name ?? `${type} ${parts.join("/")}`,
      requestModels: requestModel
        ? { "application/json": requestModel }
        : undefined,
      requestValidator: validator,
    });
  }
}
