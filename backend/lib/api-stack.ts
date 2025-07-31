import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ApiGatewayStackProps extends cdk.StackProps {
  getHandler: lambda.IFunction;
  stageName: string;
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    // API Gateway
    const api = new apigateway.RestApi(this, "Api", {
      restApiName: `TestServiceApi-${props.stageName}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
      deployOptions: {
        stageName: props.stageName, // Use dynamic stageName
      },
    });

    // GET endpoint
    const getResource = api.root.addResource("get");
    getResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(props.getHandler),
    );

    // Output API endpoint
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: `API Gateway ${props.stageName} endpoint URL`,
    });
  }
}
