import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as pipelines from "aws-cdk-lib/pipelines";
import * as iam from "aws-cdk-lib/aws-iam";
import { LambdasStack } from "./lambdas-stack";
import { ApiGatewayStack } from "./api-stack";

interface AppStageProps extends cdk.StageProps {
  stageName: string;
}

class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    const lambdasStack = new LambdasStack(this, "LambdasStack", {
      env: props.env,
    });

    new ApiGatewayStack(this, "ApiGatewayStack", {
      getHandler: lambdasStack.getHandler,
      env: props.env,
      stageName: props.stageName,
    });
  }
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubRepo = {
      owner: "maciejpvp", // Replace with your GitHub username
      repo: "data_guard", // Replace with your GitHub repo name
      branch: "main", // Default branch for pipeline trigger
    };

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: "TestServicePipeline",
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.gitHub(
          `${githubRepo.owner}/${githubRepo.repo}`,
          githubRepo.branch,
          {
            authentication: cdk.SecretValue.secretsManager("github-token"), // Store GitHub token in AWS Secrets Manager
          },
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
      selfMutation: true,
    });

    pipeline.addStage(
      new AppStage(this, "Prod", {
        stageName: "prod",
        env: {
          account: "445567075183", // Replace with your AWS prod account ID
          region: "eu-central-1", // Replace with your region
        },
      }),
    );

    // Test stage for test branch
    pipeline
      .addWave("TestWave", {
        pre: [
          new pipelines.CodeBuildStep("CheckBranch", {
            commands: [
              // Check if the commit is on the test branch
              'if [ "$CODEBUILD_SOURCE_VERSION" = "test" ]; then exit 0; else exit 1; fi',
            ],
            role: new iam.Role(this, "CheckBranchRole", {
              assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
              managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                  "AWSCodeBuildDeveloperAccess",
                ),
              ],
            }),
          }),
        ],
      })
      .addStage(
        new AppStage(this, "Test", {
          stageName: "test",
          env: {
            account: "445567075183", // Replace with your AWS test account ID
            region: "eu-central-1", // Replace with your region
          },
        }),
      );
  }
}
