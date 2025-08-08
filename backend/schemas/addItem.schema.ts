import * as apigateway from "aws-cdk-lib/aws-apigateway";

const schema: apigateway.JsonSchema = {
  type: apigateway.JsonSchemaType.OBJECT,
  required: ["name", "type", "secret"],
  properties: {
    name: {
      type: apigateway.JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 50,
    },
    url: {
      type: apigateway.JsonSchemaType.STRING,
      format: "uri",
      pattern: "^(https?:\\/\\/)",
    },
    type: {
      type: apigateway.JsonSchemaType.STRING,
      enum: ["password", "creditcard", "token", "note"],
    },
    secret: {
      type: apigateway.JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 1000,
    },
  },
  additionalProperties: false,
};

export const addItemSchema = {
  modelName: "addItemSchema",
  schema,
};
