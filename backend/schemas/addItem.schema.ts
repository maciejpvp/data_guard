import * as apigateway from "aws-cdk-lib/aws-apigateway";

const schema: apigateway.JsonSchema = {
  type: apigateway.JsonSchemaType.OBJECT,
  required: ["secret"],
  properties: {
    secret: {
      type: apigateway.JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 10000,
    },
  },
  additionalProperties: false,
};

export const addItemSchema = {
  modelName: "addItemSchema",
  schema,
};
