import * as apigateway from "aws-cdk-lib/aws-apigateway";

const schema: apigateway.JsonSchema = {
  type: apigateway.JsonSchemaType.OBJECT,
  required: ["name", "type"],
  properties: {
    name: {
      type: apigateway.JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 50,
    },
    type: {
      type: apigateway.JsonSchemaType.STRING,
      enum: ["password", "creditcard", "token", "note"],
    },
  },
  additionalProperties: false,
};

export const addItemSchema = {
  modelName: "addItemSchema",
  schema,
};
